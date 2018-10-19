const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');

const articlesRoutes = require('./api/routes/articles');
const commentsRouter = require('./api/routes/comments');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

// Prevent CORS errors (should be before all the routes)
app.use((req, res, next) => {
    // can change the star to allow access only from certain url
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


// Routes for the request
app.use('/articles', articlesRoutes);
app.use('/comments', commentsRouter);

// Error handling
app.use((req, resp, next) => {
    const err = new Error('Resource not found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message,
        },
    });
});

module.exports = app;
