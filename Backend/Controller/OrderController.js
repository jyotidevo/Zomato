const Order = require('../Models/OrderModel');
const User = require('../Models/UserModel');

const CreateOrder = async (req, res) => {
    try {
        const { userId, restaurantName, items, totalPrice, deliveryFee, platformFee, gst, tip, grandTotal, address, paymentMethod } = req.body;
        
        // Generate a unique human-readable order ID like ZOM9934
        const orderId = 'ZOM' + Math.floor(1000 + Math.random() * 9000);

        const newOrder = await Order.create({
            orderId,
            userId,
            restaurantName,
            items: typeof items === 'string' ? items : JSON.stringify(items),
            totalPrice,
            deliveryFee,
            platformFee,
            gst,
            tip,
            grandTotal,
            address,
            paymentMethod,
            status: 'Order Placed'
        });

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const GetAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({ order: [['createdAt', 'DESC']] });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const GetOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({ where: { orderId: req.params.id } });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const GetOrdersByUserId = async (req, res) => {
    try {
        const orders = await Order.findAll({ where: { userId: req.params.userId }, order: [['createdAt', 'DESC']] });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const UpdateOrder = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        await order.update(req.body);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const DeleteOrder = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        await order.destroy();
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { CreateOrder, GetAllOrders, GetOrderById, GetOrdersByUserId, UpdateOrder, DeleteOrder };
