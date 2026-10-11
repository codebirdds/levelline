'use strict';

const { verifyToken } = require('../utils/auth');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: 'Authorization header missing'
            });
        }

        // Format: Bearer <token>
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: 'Token missing'
            });
        }

        const decoded = verifyToken(token);

        req.user = decoded; // attach user info to request

        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired token',
            error: error.message
        });
    }
};

module.exports = authMiddleware;