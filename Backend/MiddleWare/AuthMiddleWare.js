const jwt = require('jsonwebtoken');
const User = require('../Models/UserModel');
const JWT_SECRET = process.env.JWT_SECRET || 'zomato-secret-key';

const generateToken = (user) => {
    return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '24h' });
}

const authenticateToken = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'no token' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        // Check if user is blocked
        const user = await User.findByPk(decodedToken.id);
        if (!user) return res.status(401).json({ error: 'user not found' });
        if (user.isBlocked) return res.status(403).json({ error: 'account is blocked' });
        req.user = { ...decodedToken, isAdmin: user.isAdmin };
        next();
    } catch (error) {
        res.status(403).json({ error: 'invalid token' });
    }
}

const adminOnly = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ error: 'admin access required' });
    }
    next();
}

module.exports = { generateToken, authenticateToken, adminOnly };
