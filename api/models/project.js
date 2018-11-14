const mongoose = require('mongoose');

const ProjectSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    title: { type: String, required: true },
    url: { type: String, required: false },
    github: { type: String, required: true },
    description: String,
    image: String,
    stack: [{
        type: String,
    }],
});

module.exports = mongoose.model('Project', ProjectSchema);
