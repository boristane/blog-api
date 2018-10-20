const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const Article = require('../models/article');

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    },
});
const filter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/octet-stream') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const limits = {
    fileSize: 1024 * 1024 * 5,
};
const upload = multer({ storage, limits, filter }).fields([
    { name: 'content', maxCount: 1 },
    { name: 'image', maxCount: 1 },
]);

router.get('/', (req, res, next) => {
    Article.find()
        .select('_id title description tags createdAt updatedAt image content')
        .limit(10)
        .exec()
        .then((documents) => {
            const response = {
                count: documents.length,
                articles: documents.map(doc => ({
                    _id: doc._id,
                    title: doc.title,
                    description: doc.description,
                    image: doc.image,
                    content: doc.content,
                    tags: doc.tags,
                    createdAt: doc.createdAt,
                    updatedAt: doc.updatedAt,
                    request: {
                        type: 'GET',
                        url: `${process.env.URL}:${process.env.PORT || 3000}/articles/${doc._id}`,
                    },
                })),
            };
            res.status(200).json(response);
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
});

router.post('/', upload, (req, res, next) => {
    const {
        title,
        description,
        tags,
    } = req.body;

    const content = req.files.content[0].path;
    const image = req.files.image[0].path;

    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const article = new Article({
        _id: new mongoose.Types.ObjectId(),
        title,
        description,
        image,
        tags,
        content,
        createdAt,
        updatedAt,
    });

    article.save()
        .then((result) => {
            const response = {
                message: 'Article created successfully.',
                article: {
                    _id: result._id,
                    title: result.title,
                    description: result.description,
                    image: result.image,
                    tags: result.tags,
                    content: result.content,
                    createdAt: result.createdAt,
                },
                request: {
                    type: 'GET',
                    url: `${process.env.URL}:${process.env.PORT || 3000}/articles/${result._id}`,
                },
            };
            res.status(201).json(response);
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
});

router.get('/:articleID', (req, res, next) => {
    const { articleID } = req.params;
    Article.findById(articleID)
        .select('_id title description tags createdAt updatedAt content image')
        .exec()
        .then((document) => {
            if (!document) {
                return res.status(404).json({
                    message: 'No valid entry found.',
                });
            }
            return res.status(200).json({
                article: document,
                request: {
                    type: 'GET',
                    url: `${process.env.URL}:${process.env.PORT || 3000}/articles`,
                },
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
});

router.patch('/:articleID', (req, res, next) => {
    const { articleID } = req.params;
    const updateOps = {};
    Object.keys(req.body).forEach((key) => {
        updateOps[key] = req.body[key];
    });
    updateOps.updatedAt = new Date().toISOString();
    Article.updateOne({ _id: articleID }, { $set: updateOps })
        .exec()
        .then((result) => {
            res.status(200).json({
                message: 'Article updated.',
                request: {
                    type: 'GET',
                    url: `${process.env.URL}:${process.env.PORT || 3000}/articles/${articleID}`,
                },
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
});

router.delete('/:articleID', (req, res, next) => {
    const { articleID } = req.params;
    Article.deleteOne({ _id: articleID })
        .exec()
        .then((result) => {
            res.status(200).json({
                message: 'Article deleted.',
                request: {
                    type: 'GET',
                    url: `${process.env.URL}:${process.env.PORT || 3000}/articles`,
                },
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
});

module.exports = router;
