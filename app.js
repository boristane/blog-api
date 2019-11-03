const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');

const articlesRouter = require('./api/routes/articles');
const commentsRouter = require('./api/routes/comments');
const usersRouter = require('./api/routes/users');
const artPiecesRouter = require('./api/routes/artPieces');
const projectsRouter = require('./api/routes/projects');

const app = express();

const mongoDBURI = `mongodb+srv://boristane:${
    process.env.MONGO_ATLAS_PASSWORD
}@blog-fy3jk.gcp.mongodb.net/${process.env.DATABASE}?retryWrites=true`;
mongoose.connect(mongoDBURI, { useNewUrlParser: true });

app.use(morgan('dev'))
    .use(express.json({ extended: true }));

// Prevent CORS errors (should be before all the routes)
app.use((req, res, next) => {
    // can change the star to allow access only from certain url
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    return next();
});

// Static folder
app.use('/uploads', express.static('uploads'));

// Routes for the request
app.use('/articles', articlesRouter);
app.use('/comments', commentsRouter);
app.use('/users', usersRouter);
app.use('/artPieces', artPiecesRouter);
app.use('/projects', projectsRouter);

// Error handling
app.use((req, resp, next) => {
    const err = new Error('Resource not found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;
