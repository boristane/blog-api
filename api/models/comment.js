const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    author: { type: String, required: true },
    content: { type: String, required: true },
    onID: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
    createdAt: { type: String, required: true },
    updatedAt: String,
});

module.exports = mongoose.model('Comment', commentSchema);
