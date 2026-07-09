const User = require('../Models/UserModel');

//create user
const createUser = async (req, res) => {
    try {
        const { mobile, password } = req.body;

        if (!mobile || !password) {
            return res.status(400).json({ error: 'mobile and password are required' });
        }

        const existingUser = await User.findOne({ where: { mobile } });
        if (existingUser) {
            return res.status(409).json({ error: 'mobile number already registered' });
        }

        const newuser = await User.create({ mobile, password });
        res.status(201).json({
            message: 'user created successfully',
            user: {
                id: newuser.id,
                mobile: newuser.mobile,
            },
        });
    } catch (err) {
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
        const { mobile, password } = req.body;
        const user = await User.findOne({ where: { mobile } });
        if (!user) {
            res.status(404).json({ error: 'user not found' });
        }
        else {
            if (user.password !== password) {
                return res.status(401).json({ error: 'invalid password' });
            }
            else {
                res.status(200).json({
                    message: 'user logged in successfully',
                    user: {
                        id: user.id,
                        mobile: user.mobile,
                    },
                });
            }
        }
    } catch (err) {
        res.status(500).json({ error: 'internal server error' });
    }
}



module.exports = { createUser, getalluser, deleteuser, loginUser };
