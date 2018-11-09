const mongoose = require('mongoose');

const artPieceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    inspiration: { type: String },
    lang: String,
    quote: {
        text: String,
        author: String,
        ref: String,
        url: String,
    },
    image: { type: String, required: true },
    js: { type: String, required: true },
    createdAt: { type: String, required: true },
    updatedAt: String,
});

module.exports = mongoose.model('ArtPiece', artPieceSchema);
