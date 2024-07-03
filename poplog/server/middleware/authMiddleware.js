const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SECRET_KEY = "your_secret_key";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = await User.findById(decoded.userId);
        next();
    } catch (error) {
        res.status(401).send('Unauthorized');
    }
};

module.exports = authMiddleware;
