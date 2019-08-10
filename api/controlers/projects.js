const mongoose = require("mongoose");
const Project = require("../models/project");

exports.getAll = async (req, res, next) => {
  try {
    const documents = await Project.find()
      .select("_id title url github description image stack createdAt updatedAt")
      .exec();
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
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        request: {
          type: "GET",
          url: `${process.env.URL}/projects/${doc._id}`
        }
      }))
    };
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};

exports.post = async (req, res, next) => {
  const { title, url, github, description } = req.body;

  const stack = req.body.stack.split(", ");
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
    updatedAt
  });

  try {
    const result = await project.save();
    const response = {
      message: "Project created successfully.",
      project: {
        _id: result._id,
        title: result.title,
        url: result.url,
        github: result.github,
        description: result.description,
        stack: result.stack,
        image: result.image,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt
      },
      request: {
        type: "GET",
        url: `${process.env.URL}/projets/${result._id}`
      }
    };
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};

exports.get = async (req, res, next) => {
  const { projectID } = req.params;
  try {
    const document = await Project.findById(projectID)
      .select("_id title url github description image stack createdAt updatedAt")
      .exec();
    if (!document) {
      return res.send(404).json({
        message: "No valid entry found."
      });
    }
    res.status(200).json({
      project: document,
      request: {
        type: "GET",
        url: `${process.env.URL}/projects`
      }
    });
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};

exports.patch = async (req, res, next) => {
  const { projectID } = req.params;
  const updateOps = {};
  Object.keys(req.body).forEach(key => {
    updateOps[key] = req.body[key];
  });
  updateOps.updatedAt = new Date().toISOString();
  try {
    const result = await Project.updateOne({ _id: projectID }, { $set: updateOps }).exec();
    res.status(200).json({
      message: "Project updated.",
      request: {
        type: "GET",
        url: `${process.env.URL}/projects/${projectID}`
      }
    });
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};

exports.delete = async (req, res, next) => {
  const { projectID } = req.params;
  try {
    const result = await Project.deleteOne({ _id: projectID }).exec();
    res.status(200).json({
      message: "Project deleted.",
      request: {
        type: "GET",
        url: `${process.env.URL}/projects`
      }
    });
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};
