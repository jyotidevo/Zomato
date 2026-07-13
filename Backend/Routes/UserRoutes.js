const { createUser, getalluser, deleteuser, loginUser, updateUser, blockUser, unblockUser, makeAdmin } = require('../Controller/UserController');
const { authenticateToken, adminOnly } = require('../MiddleWare/AuthMiddleWare');
const express = require('express');
const router = express.Router();


router.post('/signup', createUser);
router.get('/all', getalluser);
router.delete('/:id', deleteuser);
router.post('/login', loginUser);

// Admin-only routes
router.put('/admin/:id', authenticateToken, adminOnly, updateUser);
router.patch('/admin/:id/block', authenticateToken, adminOnly, blockUser);
router.patch('/admin/:id/unblock', authenticateToken, adminOnly, unblockUser);
router.patch('/admin/:id/toggle-admin', authenticateToken, adminOnly, makeAdmin);

module.exports = router;