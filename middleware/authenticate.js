const JWT = require("jsonwebtoken");
require('dotenv').config();


// This will Authorize each request with Unique JWT Token
const User_Authorization = async (req, res, next) => {
    const { authorization } = req.headers;
    try {
        if (!authorization || !authorization.startsWith("Bearer")) {
            res.status(401).json({ status: "Not Acceptable", message: "Invalid Token" })
            return;
        }
        const TOKEN = authorization.split(' ')[1];
        // Verify User TOKEN
        const Payload = JWT.verify(TOKEN, process.env.JWT_SECRET_KEY)
        req.user = { user_id: Payload.user_id, email: Payload.email, firstName: Payload.first_name };
        res.set('ExpiresIn', `${req.user.exp}`)
        next();
    } catch (err) {
        res.status(401).json({ status: "Failed", message: err.message })
    }
}


// This will Authorize each request with Unique JWT Token
const Superadmin_Authorization = async (req, res, next) => {
    const { authorization } = req.headers;
    try {
        if (!authorization || !authorization.startsWith("Bearer")) {
            res.status(401).json({ status: "Not Acceptable", message: "Invalid Token" })
            return;
        }
        const TOKEN = authorization.split(' ')[1];
        // Verify User TOKEN
        const Payload = JWT.verify(TOKEN, process.env.JWT_SECRET_KEY)
        req.user = { superUserID: Payload.super_id, email: Payload.email };
        res.set('ExpiresIn', `${req.user.exp}`)
        next();
    } catch (err) {
        res.status(401).json({ status: "Failed", message: err.message })
    }
}

module.exports = {
    User_Authorization,
    Superadmin_Authorization
}; 