const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    description: String,
    content: { type: String, required: true },
    tags: [{
        type: String,
    }],
    createdAt: { type: String, required: true },
    updatedAt: String,
});

module.exports = mongoose.model('Article', articleSchema);
