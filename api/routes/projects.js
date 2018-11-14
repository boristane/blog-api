const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const auth = require('../auth/checkAuth');
const projectsControler = require('../controlers/projects');

const router = express.Router();

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
});

const s3 = new aws.S3();

const storage = multerS3({
    s3,
    bucket: 'boristane-projects-data',
    key: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const filter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const limits = {
    fileSize: 1024 * 1024 * 5,
};
const upload = multer({ storage, limits, filter }).fields([
    { name: 'image', maxCount: 1 },
]);

router.get('/', projectsControler.getAll);

router.post('/', auth, upload, projectsControler.post);

router.get('/:projectID', projectsControler.get);

router.patch('/:projectID', auth, projectsControler.patch);

router.delete('/:projectID', auth, projectsControler.delete);

module.exports = router;
