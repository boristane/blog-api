const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'handling GET requests to /articles',
    });
});

router.post('/', (req, res, next) => {
    const {
        title,
        description,
        image,
        tags,
    } = req.body;

    const article = {
        title,
        description,
        image,
        tags,
    };

    res.status(201).json({
        message: 'handling POST requests to /articles',
        createdArticle: article,
    });
});

router.get('/:articleID', (req, res, next) => {
    const { articleID } = req.params;
    res.status(200).json({
        message: `handling GET request on /articles/${articleID}`,
    });
});

router.patch('/:articleID', (req, res, next) => {
    const { articleID } = req.params;
    res.status(200).json({
        message: `handling PATCH requests on /articles/${articleID}`,
    });
});

router.delete('/:articleID', (req, res, next) => {
    const { articleID } = req.params;
    res.status(200).json({
        message: `handling DELETE requests on /articles/${articleID}`,
    });
});

module.exports = router;
