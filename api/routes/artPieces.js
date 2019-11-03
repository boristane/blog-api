const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const auth = require('../auth/checkAuth');
const artPiecesControler = require('../controlers/artPieces');

const router = express.Router();

aws.config.update({
    secretAccessKey: process.env.AWS_KEY,
    accessKeyId: process.env.AWS_ID,
});

const s3 = new aws.S3();

const storage = multerS3({
    s3,
    bucket: 'boristane-arts-data',
    key: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const filter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/javascript') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const limits = {
    fileSize: 1024 * 1024 * 5,
};
const upload = multer({ storage, limits, filter }).fields([
    { name: 'js', maxCount: 1 },
    { name: 'image', maxCount: 1 },
]);

router.get('/', artPiecesControler.getAll);

router.post('/', auth, upload, artPiecesControler.post);

router.get('/:artPieceID', artPiecesControler.get);

router.patch('/:artPieceID', artPiecesControler.patch);

router.delete('/:artPieceID', auth, artPiecesControler.delete);

module.exports = router;
