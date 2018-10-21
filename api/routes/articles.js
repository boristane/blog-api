const express = require('express');
const multer = require('multer');
const auth = require('../auth/checkAuth');
const articlesControler = require('../controlers/articles');

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    },
});
const filter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/octet-stream') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const limits = {
    fileSize: 1024 * 1024 * 5,
};
const upload = multer({ storage, limits, filter }).fields([
    { name: 'content', maxCount: 1 },
    { name: 'image', maxCount: 1 },
]);

router.get('/', articlesControler.getAll);

router.post('/', auth, upload, articlesControler.post);

router.get('/:articleID', articlesControler.get);

router.patch('/:articleID', auth, articlesControler.patch);

router.delete('/:articleID', auth, articlesControler.delete);

module.exports = router;
