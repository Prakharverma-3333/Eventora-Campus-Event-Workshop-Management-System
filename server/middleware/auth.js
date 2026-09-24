const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token = req.headers.authorization;

    //Bearer → Authentication scheme.
    //JWT → Actual token.

    if (token && token.startsWith('Bearer')) {
        try {
            token = token.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //User database se find karna
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }
            next();

        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

//Ye check karta hai ki authenticated user admin role ka hai ya nahi.
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };

// Socho tumhare paas ek event ka entry pass hai.
// Bearer → "Mere paas pass (token) hai."
// JWT token → Tumhara actual entry pass.
// Server → Pass verify karke entry deta hai.