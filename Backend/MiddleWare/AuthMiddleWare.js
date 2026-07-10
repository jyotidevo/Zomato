const jwt = require('jsonwebtoken');  
const JWT_SECRET = process.env.JWT_SECRET || 'zomato-secret-key';

const generateToken = (user) => {
    return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });  
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'no token' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(403).json({ error: 'invalid token' });
    }
};

module.exports = { generateToken, authenticateToken };
