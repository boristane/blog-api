const mongoose = require('mongoose');
const Project = require('../models/project');

exports.getAll = (req, res, next) => {
    Project.find()
        .select('_id title url github description image stack')
        .limit(10)
        .exec()
        .then((documents) => {
            const response = {
                count: documents.length,
                projects: documents.map(doc => ({
                    _id: doc._id,
                    title: doc.title,
                    url: doc.url,
                    github: doc.github,
                    description: doc.description,
                    image: doc.image,
                    stack: doc.stack,
                    request: {
                        type: 'GET',
                        url: `${process.env.URL}/projects/${doc._id}`,
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
        url,
        github,
        description,
    } = req.body;

    const stack = req.body.stack.split(', ');
    const image = req.files.image[0].location;

    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const project = new Project({
        _id: new mongoose.Types.ObjectId(),
        title,
        url,
        github,
        description,
        stack,
        image,
        createdAt,
        updatedAt,
    });

    project.save()
        .then((result) => {
            const response = {
                message: 'Project created successfully.',
                project: {
                    _id: result._id,
                    title: result.title,
                    url: result.url,
                    github: result.github,
                    description: result.description,
                    stack: result.stack,
                    image: result.image,
                    createdAt: result.createdAt,
                    updatedAt: result.updatedAt,
                },
                request: {
                    type: 'GET',
                    url: `${process.env.URL}/projets/${result._id}`,
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
    const { projectID } = req.params;
    Project.findById(projectID)
        .select('_id title url github description image stack createdAt updatedAt')
        .exec()
        .then((document) => {
            if (!document) {
                return res.send(404).json({
                    message: 'No valid entry found.',
                });
            }
            res.status(200).json({
                project: document,
                request: {
                    type: 'GET',
                    url: `${process.env.URL}/projects`,
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
    const { projectID } = req.params;
    const updateOps = {};
    Object.keys(req.body).forEach((key) => {
        updateOps[key] = req.body[key];
    });
    updateOps.updatedAt = new Date().toISOString();
    Project.updateOne({ _id: projectID }, { $set: updateOps })
        .exec()
        .then((result) => {
            res.status(200).json({
                message: 'Project updated.',
                request: {
                    type: 'GET',
                    url: `${process.env.URL}/projects/${projectID}`,
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
    const { projectID } = req.params;
    Project.deleteOne({ _id: projectID })
        .exec()
        .then((result) => {
            res.status(200).json({
                message: 'Project deleted.',
                request: {
                    type: 'GET',
                    url: `${process.env.URL}/projects`,
                },
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};
