const { createUser, getalluser, deleteuser, loginUser } = require('../Controller/UserController');
const express = require('express');
const router = express.Router();


router.post('/signup', createUser);
router.get('/all', getalluser);
router.delete('/:id', deleteuser);
router.post('/login', loginUser);

module.exports = router;