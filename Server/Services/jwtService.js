const Token = require('../Models/token');
const JWT = require('jsonwebtoken');

const Token_Secret_Key = "902e979394929598dd3155c635862173f5666f5e2811e05d3616905552a7e91a";

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