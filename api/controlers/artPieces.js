const mongoose = require('mongoose');
const ArtPiece = require('../models/artPiece');

exports.getAll = (req, res, next) => {
    ArtPiece.find()
        .select('_id title createdAt updatedAt inspiration lang quote image js')
        .limit(30)
        .exec()
        .then((documents) => {
            const response = {
                count: documents.length,
                artPieces: documents.map(doc => ({
                    _id: doc._id,
                    title: doc.title,
                    createdAt: doc.createdAt,
                    updatedAt: doc.updatedAt,
                    inspiration: doc.inspiration,
                    lang: doc.lang,
                    quote: doc.quote,
                    image: doc.image,
                    js: doc.js,
                    request: {
                        type: 'GET',
                        url: `${process.env.URL}/artpieces/${doc._id}`,
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
        inspiration,
        lang,
    } = req.body;
    const quote = {
        text: req.body.text,
        author: req.body.author,
        ref: req.body.ref,
        url: req.body.url,
    };
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const image = req.files.image[0].location;
    const js = req.files.js[0].location;

    const artPiece = new ArtPiece({
        _id: new mongoose.Types.ObjectId(),
        title,
        inspiration,
        lang,
        quote,
        image,
        js,
        createdAt,
        updatedAt,
    });

    artPiece.save()
        .then((result) => {
            const response = {
                message: 'Art Piece created successfully.',
                artPiece: {
                    _id: result._id,
                    title: result.title,
                    inspiration: result.inspiration,
                    lang: result.lang,
                    quote: result.quote,
                    image: result.image,
                    js: result.js,
                    createdAt: res.createdAt,
                    request: {
                        type: 'GET',
                        url: `${process.env.URL}/artpieces/${result._id}`,
                    },
                },
            };
            res.status(200).json(response);
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};

exports.get = (req, res, next) => {
    const { artPieceID } = req.params;
    ArtPiece.findById(artPieceID)
        .select('_id title createdAt updatedAt inspiration lang quote image js')
        .exec()
        .then((document) => {
            if (!document) {
                res.status(404).json({
                    message: 'No valid entry found.',
                });
            }
            res.status(200).json({
                artPiece: document,
                request: {
                    type: 'GET',
                    url: `${process.env.URL}/artpieces`,
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
    const { artPieceID } = req.params;
    const updateOps = {};
    Object.keys(req.body).forEach((key) => {
        updateOps[key] = req.body[key];
    });
    updateOps.updatedAt = new Date().toISOString();
    ArtPiece.updateOne({ _id: artPieceID }, { $set: updateOps })
        .exec()
        .then((result) => {
            res.status(200).json({
                message: 'Art Piece updated.',
                request: {
                    type: 'GET',
                    url: `${process.env.URL}/artpieces/${artPieceID}`,
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
    const { artPieceID } = req.params;
    ArtPiece.findByIdAndRemove(artPieceID)
        .exec()
        .then((result) => {
            res.status(200).json({
                message: 'Art Piece deleted.',
                request: {
                    type: 'GET',
                    url: `${process.env.URL}/artpieces`,
                },
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};
