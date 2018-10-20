const express = require('express');
const mongoose = require('mongoose');
const Article = require('../models/article');

const router = express.Router();

router.get('/', (req, res, next) => {
    Article.find()
        .limit(10)
        .exec()
        .then((documents) => {
            console.log(documents);
            if (documents) {
                res.status(200).json(documents);
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
});

router.post('/', (req, res, next) => {
    const {
        title,
        description,
        image,
        tags,
    } = req.body;

    const article = new Article({
        _id: new mongoose.Types.ObjectId(),
        title,
        description,
        image,
        tags,
    });

    article.save()
        .then((result) => {
            console.log(result);
            res.status(201).json(article);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
});

router.get('/:articleID', (req, res, next) => {
    const { articleID } = req.params;
    Article.findById(articleID)
        .exec()
        .then((document) => {
            console.log(document);
            if (document) {
                return res.status(200).json(document);
            }
            return res.status(404).json({ message: 'No valid entry found.' });
        })
        .catch((err) => {
            console.log(err);
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
    Article.updateOne({ _id: articleID }, { $set: updateOps })
        .exec()
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
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
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
});

module.exports = router;
