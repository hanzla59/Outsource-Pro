const Token = require('../Models/token');
const JWT = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const Token_Secret_Key = process.env.Token_Secret_Key;

class JWTService {
    static signToken(payload, expiryTime) {
        return JWT.sign(payload, Token_Secret_Key, { expiresIn: expiryTime });
    }

    static verifyToken(token) {
        try {
            return JWT.verify(token, Token_Secret_Key);
        } catch (error) {
            console.error("Token verification failed:", error);
            return null; // Return null or handle this case appropriately
        }
    }

    static async storeToken(token, userId) {
        try {
            const newToken = new Token({
                token: token,
                userId: userId
            });
            await newToken.save();
            return true; // Indicate success
        } catch (error) {
            console.error("Failed to store token:", error);
            return false; // Indicate failure
        }
    }
}

module.exports = JWTService;