const express = require('express');
const volleyball = require('volleyball');

const app = express();

const auth = require('./auth');

app.use(volleyball);

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Job Tracker API'
    });
});

app.use('/auth', auth);

app.use(errorHandler);
app.use(notFound);

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