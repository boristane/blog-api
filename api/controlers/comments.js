const mongoose = require('mongoose');

const Comment = require('../models/comment');
const Article = require('../models/article');

exports.getByArticle = (req, res, next) => {
    const { articleID } = req.params;
    Comment.find({ onID: articleID })
        .exec()
        .then((documents) => {
            if (documents.length <= 0) {
                return res.status(404).json({
                    message: 'No valid entry found.',
                });
            }
            const comments = documents.map(doc => ({
                _id: doc._id,
                author: doc.author,
                content: doc.content,
                onID: doc.onID,
                createdAt: doc.createdAt,
                updatedAt: doc.updatedAt,
            }));
            const response = {
                count: documents.length,
                comments,
                request: {
                    type: 'GET',
                    url: `${process.env.URL}:${process.env.PORT || 3000}/articles/${articleID}`,
                },
            };
            return res.status(200).json(response);
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};

exports.get = (req, res, next) => {
    const { commentID } = req.params;
    Comment.findById(commentID)
        .select('author content onID createdAt updatedAt')
        .exec()
        .then((document) => {
            if (!document) {
                return res.status(404).json({
                    message: 'No valid entry found.',
                });
            }
            return res.status(200).json(document);
        })
        .catch((err) => {

            res.status(500).json({
                error: err,
            });
        });
};

exports.post = (req, res, next) => {
    const { author, content, onID } = req.body;
    Article.findById(onID)
        .exec()
        .then((article) => {
            if (!article) {
                return res.status(404).json({
                    message: 'No valid article found.',
                });
            }
            const createdAt = new Date().toISOString();
            const updatedAt = createdAt;
            const comment = new Comment({
                _id: new mongoose.Types.ObjectId(),
                author,
                content,
                onID: article._id,
                createdAt,
                updatedAt,
            });
            return comment.save();
        })
        .then((result) => {
            const response = {
                message: 'Comment created successfully.',
                comment: {
                    id: result._id,
                    author: result.author,
                    content: result.content,
                    onID: result.onID,
                    createdAt: result.createdAt,
                },
                request: {
                    type: 'GET',
                    url: `${process.env.URL}:${process.env.PORT}/articles/${result.onID}`,
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

exports.delete = (req, res, next) => {
    const { commentID } = req.params;
    Comment.deleteOne({ _id: commentID })
        .exec()
        .then((result) => {
            res.status(200).json({
                message: 'Comment deleted.',
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};
