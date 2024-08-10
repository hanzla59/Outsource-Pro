const User = require('../Models/user');
const JWT = require('../Services/jwtService');

const auth = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        const error = new Error("Unauthorized Access");
        error.status = 401;
        return next(error);
    }

    try {
        const decodeToken = JWT.verifyToken(token);
        if (!decodeToken) {
            const error = new Error("Unauthorized Access");
            error.status = 401;
            return next(error);
        }
        
        const user = await User.findById(decodeToken._id);
        if (!user) {
            const error = new Error("Unauthorized Access");
            error.status = 401;
            return next(error);
        }
        
        // Add the user to the request object for further use in the route handler
        req.user = user;
    } catch (error) {
        return next(error);
    }

    next();
}

module.exports = auth;
