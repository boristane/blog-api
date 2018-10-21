const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const router = express.Router();

router.get('/', (req, res, next) => {
    User.find()
        .select('username email createdAt updatedAt')
        .exec()
        .then((documents) => {
            const response = {
                count: documents.length,
                users: documents.map(doc => ({
                    _id: doc._id,
                    username: doc.username,
                    email: doc.email,
                    createdAt: doc.createdAt,
                    updatedAt: doc.updatedAt,
                    request: {
                        type: 'GET',
                        url: `${process.env.URL}:${process.env.PORT || 3000}/users/${doc._id}`,
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

router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then((documents) => {
            if (documents.length >= 1) {
                return res.status(409).json({
                    message: 'User already created.',
                });
            }
            const createdAt = new Date().toISOString();
            const updatedAt = createdAt;
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err,
                    });
                }
                const user = new User({
                    _id: mongoose.Types.ObjectId(),
                    username: req.body.username,
                    email: req.body.email,
                    password: hash,
                    createdAt,
                    updatedAt,
                });
                user.save()
                    .then((result) => {
                        const response = {
                            message: 'User created successfully.',
                            article: {
                                _id: result._id,
                                username: result.usermane,
                                email: result.email,
                                createdAt: result.createdAt,
                            },
                            request: {
                                type: 'GET',
                                url: `${process.env.URL}:${process.env.PORT || 3000}/users/${result._id}`,
                            },
                        };
                        return res.status(201).json(response);
                    })
                    .catch((error) => {
                        res.status(500).json({
                            error,
                        });
                    });
            });
        });
});

router.get('/:userID', (req, res, next) => {
    User.findOne({ _id: req.params.userID })
        .select('username email createdAt updatedAt')
        .exec()
        .then((document) => {
            if (!document) {
                return res.status(404).json({
                    message: 'No valid user found.',
                });
            }
            return res.status(200).json({
                user: document,
                request: {
                    type: 'GET',
                    url: `${process.env.URL}:${process.env.PORT || 3000}/users`,
                },
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
});

router.delete('/:userID', (req, res, next) => {
    User.deleteOne({ _id: req.params.userID })
        .exec()
        .then((result) => {
            res.status(200).json({
                message: 'User deleted.',
                request: {
                    type: 'GET',
                    url: `${process.env.URL}:${process.env.PORT || 3000}/users`,
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
