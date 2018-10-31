const mongoose = require('mongoose');
const Article = require('../models/article');

exports.getAll = (req, res, next) => {
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
                    hiddent: doc.hidden,
                    request: {
                        type: 'GET',
                        url: `${process.env.URL}/articles/${doc._id}`,
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
};

exports.post = (req, res, next) => {
    const {
        title,
        description,
    } = req.body;

    const tags = req.body.tags.split(', ');
    const content = req.files.content[0].location;
    const image = req.files.image[0].location;

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
                    url: `${process.env.URL}/articles/${result._id}`,
                },
            };
            res.status(201).json(response);
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};

exports.get = (req, res, next) => {
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
                    url: `${process.env.URL}/articles`,
                },
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};

exports.patch = (req, res, next) => {
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
                    url: `${process.env.URL}/articles/${articleID}`,
                },
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};

exports.delete = (req, res, next) => {
    const { articleID } = req.params;
    Article.deleteOne({ _id: articleID })
        .exec()
        .then((result) => {
            res.status(200).json({
                message: 'Article deleted.',
                request: {
                    type: 'GET',
                    url: `${process.env.URL}/articles`,
                },
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};
