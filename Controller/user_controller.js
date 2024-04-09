const DBConfig = require("../db/mysql")
const users = DBConfig.users



// This Function Will Register user 
const register_user = async (req, res) => {
    try {
        const { email, first_name, last_name, phone_number } = req.body
        if (!email || !first_name || !last_name || !phone_number) {
            res.status(400).json({ message: "Invalid Request", status: "Missing Required Parameters" })
            return;
        }
        let new_user = await users.create({ ...req.body })
        res.status(201).json({ status: "Successful", new_user })
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: "Phone Number Already taken!", errorType: err.name })
        } else {
            res.status(500).json({ message: "Internal Server Error", errorType: err.name })
        }
    }
}

// view user
const view_user = async (req, res) => {
    try {
        const { phone_number } = req.params
        if (!phone_number) {
            res.status(400).json({ message: "Invalid Request", status: "Missing Required Parameters" })
            return;
        }
        let user = await users.findOne({ phone_number })
        res.status(200).json({ status: "Successful", user })
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: "Phone Number Already taken!", errorType: err.name })
        } else {
            res.status(500).json({ message: "Internal Server Error", errorType: err.name })
        }
    }
}

// update_user
const update_user = async (req, res) => {
    try {
        const { email, first_name, last_name, phone_number } = req.body
        if (!phone_number) {
            res.status(400).json({ message: "Invalid Request", status: "Missing Required Parameters" })
            return;
        }
        let updated_user = await users.update({ email, first_name, last_name }, { where: { phone_number }, returning: true })
        res.status(201).json({ status: "Successfull", updated_user, mesage: "Phone Number can not be Updated!" })
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: "Phone Number Already taken!", errorType: err.name })
        } else {
            res.status(500).json({ message: "Internal Server Error", errorType: err.name })
        }
    }
}

``
module.exports = {
    register_user,
    view_user,
    update_user,
}