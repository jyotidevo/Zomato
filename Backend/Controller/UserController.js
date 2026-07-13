const User = require('../Models/UserModel');
const { generateToken } = require('../MiddleWare/AuthMiddleWare');

//create user
const createUser = async (req, res) => {
    try {
        const { mobile, password, username, email } = req.body;

        if (!mobile || !password) {
            return res.status(400).json({ error: 'mobile and password are required' });
        }

        const existingUser = await User.findOne({ where: { mobile } });
        if (existingUser) {
            return res.status(409).json({ error: 'mobile number already registered' });
        }

        if (email) {
            const existingEmail = await User.findOne({ where: { email } });
            if (existingEmail) {
                return res.status(409).json({ error: 'email already registered' });
            }
        }

        // Auto-promote admin@zomato.com to Admin
        const isAdmin = email === 'admin@zomato.com';

        const newuser = await User.create({ mobile, password, username, email, isAdmin });
        const token = generateToken(newuser);
        res.status(201).json({
            message: 'user created successfully',
            user: {
                id: newuser.id,
                mobile: newuser.mobile,
                email: newuser.email,
                username: newuser.username,
                isAdmin: newuser.isAdmin,
            },
            token,
        });
    } catch (err) {
        console.error(err);
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: err.errors[0]?.message || 'invalid user data' });
        }

        res.status(500).json({ error: 'internal server error' });
    }
}



//get all users
const getalluser = async (req, res) => {
    try {
        const allusers = await User.findAll();
        res.status(200).json(allusers);
    } catch (err) {
        res.status(500).json({ error: 'internal server error' });
    }
};

//delete user
const deleteuser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            res.status(404).json({ error: 'user not found' });
        }
        else {
            await user.destroy();
            res.status(200).json({ message: 'user deleted successfully' });
        }
    } catch (err) {
        res.status(500).json({ error: 'internal server error' });
    }
};
const loginUser = async (req, res) => {
    try {
        const { mobile, email, password } = req.body;
        let user;
        if (mobile) {
            user = await User.findOne({ where: { mobile } });
        } else if (email) {
            user = await User.findOne({ where: { email } });
        }

        if (!user) {
            return res.status(404).json({ error: 'user not found' });
        }

        if (user.isBlocked) {
            return res.status(403).json({ error: 'account is blocked by admin' });
        }

        if (user.password !== password) {
            return res.status(401).json({ error: 'invalid password' });
        }

        const token = generateToken(user);
        res.status(200).json({
            message: 'user logged in successfully',
            user: {
                id: user.id,
                mobile: user.mobile,
                email: user.email,
                username: user.username,
                isAdmin: user.isAdmin,
            },
            token,
        });
    } catch (err) {
        res.status(500).json({ error: 'internal server error' });
    }
}

// Admin: update user details
const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'user not found' });
        const { username, email, mobile, password, isAdmin, isBlocked } = req.body;

        const updates = { username, email, mobile, isAdmin, isBlocked };
        if (password) updates.password = password;

        await user.update(updates);
        res.status(200).json({ message: 'user updated', user });
    } catch (err) {
        res.status(500).json({ error: 'internal server error' });
    }
};

// Admin: toggle block/unblock
const blockUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'user not found' });
        await user.update({ isBlocked: true });
        res.status(200).json({ message: 'user blocked' });
    } catch (err) {
        res.status(500).json({ error: 'internal server error' });
    }
};

const unblockUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'user not found' });
        await user.update({ isBlocked: false });
        res.status(200).json({ message: 'user unblocked' });
    } catch (err) {
        res.status(500).json({ error: 'internal server error' });
    }
};

const makeAdmin = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'user not found' });
        await user.update({ isAdmin: !user.isAdmin });
        res.status(200).json({ message: `user is now ${user.isAdmin ? 'admin' : 'regular user'}`, isAdmin: user.isAdmin });
    } catch (err) {
        res.status(500).json({ error: 'internal server error' });
    }
};

module.exports = { createUser, getalluser, deleteuser, loginUser, updateUser, blockUser, unblockUser, makeAdmin };
