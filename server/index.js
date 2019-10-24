const express = require('express');
const dotenv = require('dotenv').config();
const volleyball = require('volleyball');
const passport = require('passport');
const cookieSession = require('cookie-session');
const mongoose = require('mongoose');
const cors = require('cors');
// const cookieParser = require('cookie-parser');

const auth = require('./auth');
const jobs = require('./api/jobs');

const passportSetup = require('./config/passport-setup');

const app = express();



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
app.use(express.urlencoded({ extended: false }));

// set up cors to allow us to accept requests from our client
app.use(
    cors({
      origin: "http://localhost:3000", // allow to server to accept request from different origin
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true // allow session cookie from browser to pass through
    })
  );

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Job Tracker API'
    });
});

app.use('/auth', auth);

app.use('/api/v1/jobs', isAuthenticated, jobs);

app.use(errorHandler);
app.use(notFound);

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

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Listening on port', port);
});