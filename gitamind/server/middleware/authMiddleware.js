const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const authorize = (...roles) => (req, res, next) => {
    if (!req.user || !req.user.roles || !roles.some(role => req.user.roles.includes(role))) {
        return res.status(403).json({ message: `User role is not authorized to access this route. Required roles: ${roles.join(', ')}` });
    }
    next();
};

module.exports = { protect, authorize };