const express = require('express');

const commentsControler = require('../controlers/comments');

const router = express.Router();


router.get('/:articleID', commentsControler.getByArticle);

router.get('/:commentID', commentsControler.get);

router.post('/', commentsControler.post);

router.delete('/:commentID', commentsControler.delete);

module.exports = router;
