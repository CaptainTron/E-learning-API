const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


module.exports = (sequelize, DataTypes) => {
    const Credentials = sequelize.define('superCredentials', {
        super_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING, 
            allowNull: false, 
        },
        phone_number: { 
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                len: [0, 10], // Limit the length of the phone number to a minimum of 1 and a maximum of 10 characters
                isNumeric: true, // Ensure that the phone number consists only of numeric characters
            },
        },
        email: { 
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    // Hash the password before saving
    Credentials.beforeCreate(async (credentials, options) => {
        const salt = await bcrypt.genSalt(10);
        credentials.password = await bcrypt.hash(credentials.password, salt);
    });

    // Create the JWT token
    Credentials.prototype.createJWT = function () {
        return jwt.sign({ super_id: this.super_id, email: this.email }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.EXPIRESIN });
    };

    // Compare passwords
    Credentials.prototype.comparePasswords = async function (password) {
        const isMatch = await bcrypt.compare(password, this.password);
        return isMatch;
    };

    return Credentials;
};
