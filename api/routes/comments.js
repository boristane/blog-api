const express = require('express');

const router = express.Router();

router.get('/:commentID', (req, res, next) => {
    const { commentID } = req.params;
    res.status(200).json({
        message: `handling GET requests on /comments/${commentID}`,
    });
});

router.post('/', (req, res, next) => {
    const { username, text } = req.body;
    const comment = { username, text };
    res.status(201).json({
        message: 'handling POST requests on /comments',
        createdComment: comment,
    });
});

router.delete('/:commentID', (req, res, next) => {
    const { commentID } = req.params;
    res.status(200).json({
        message: `handling DELETE requests on /comments/${commentID}`,
    });
});

module.exports = router;
