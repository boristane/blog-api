const express = require('express');

const usersControler = require('../controlers/users');
const auth = require('../auth/checkAuth');

const router = express.Router();

router.get('/', auth, usersControler.getAll);

router.post('/signup', usersControler.signup);

router.post('/login', usersControler.login);

router.get('/:userID', auth, usersControler.get);

router.delete('/:userID', auth, usersControler.delete);

module.exports = router;
