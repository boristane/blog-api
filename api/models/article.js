const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
    image: String,
    tags: [{
        type: String,
    }],
});

module.exports = mongoose.model('Article', articleSchema);
