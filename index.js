const express = require('express');
const dotenv = require('dotenv').config();
const volleyball = require('volleyball');
const passport = require('passport');
const cookieSession = require('cookie-session');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const request = require('request');
const fetch = require('node-fetch');
// const cookieParser = require('cookie-parser');

const auth = require('./auth');
const jobs = require('./api/jobs');
const users = require('./api/users');

const seek = require('./scrapers/seek');
const indeed = require('./scrapers/indeed');

const passportSetup = require('./config/passport-setup');

const app = express();

app.use(express.static(path.join(__dirname, 'build')));

//Connect to MongoDB
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
},(err)=>{
    if(err) {
        console.error(err);
    } else {
        console.log('connected to MongoDB');
    }
});

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(volleyball);

// app.use(bodyParser.urlencoded({ extended: false }));


// set up session cookies
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.SESSION_COOKIE_KEY]
}));

// app.use(cookieParser());

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set up cors to allow us to accept requests from our client
app.use(
    cors({
      origin: "http://localhost:3000", // allow to server to accept request from different origin
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true // allow session cookie from browser to pass through
    })
  );

app.use(express.static(path.resolve(__dirname, './client/build')));

app.use('/auth', auth);

app.use('/api/v1/jobs', isAuthenticated, jobs);
app.use('/api/v1/users', isAuthenticated, users);

app.post('/api/v1/generate',async(req,res,next)=>{
    try {
        let srcUrl = req.body.srcUrl;

        let data = await fetch(srcUrl).then(res=>res.text());
        
        let jobDetails;

        if(srcUrl.includes('seek.com')) {
            jobDetails = seek.scrape(data,srcUrl);
        } else if(srcUrl.includes('indeed.com')) {
            jobDetails = await indeed.scrape(data,srcUrl);
        }


        res.json(jobDetails);
    
        
    } catch (error) {
        next(error);
    }

})

app.use(errorHandler);
app.use(notFound);

app.get('*', function(req, res) {
    res.sendFile(path.resolve(__dirname,'./client/build', 'index.html'));
});

function isAuthenticated(req, res, next) {
    if(req.user) {
        next();
    } else {
        res.statusCode = 401
        next(new Error('UnAuthorized'))
    }
}

function notFound(req, res, next) {
    res.status(404);
    const error = new Error('Not Found - ' + req.originalUrl);
    next(error);
}

function errorHandler(err, req, res, next) {
    res.status(res.statusCode || 500);
    res.json({
        message: err.message,
        stack: err.stack
    });
}

function reMap(map, data) {
    const mapEntries = Object.entries(map);
    console.log(mapEntries);
    
    for (let e of mapEntries) {
        console.log(data[e[1]], data[e[0]]);
        
        data[e[1]] = data[e[0]]
        console.log(data[e[1]])
        delete data[e[0]]
    }

    console.log('remapped', data);
    
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Listening on port', port);
});