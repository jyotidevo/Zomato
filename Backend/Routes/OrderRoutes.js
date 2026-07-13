const express = require('express');
const router = express.Router();
const { CreateOrder, GetAllOrders, GetOrderById, GetOrdersByUserId, UpdateOrder, DeleteOrder } = require('../Controller/OrderController');
const { authenticateToken, adminOnly } = require('../MiddleWare/AuthMiddleWare');

router.post('/', authenticateToken, CreateOrder);
router.get('/all', authenticateToken, adminOnly, GetAllOrders);
router.get('/:id', authenticateToken, GetOrderById);
router.get('/user/:userId', authenticateToken, GetOrdersByUserId);
router.put('/:id', authenticateToken, adminOnly, UpdateOrder);
router.delete('/:id', authenticateToken, adminOnly, DeleteOrder);

module.exports = router;
