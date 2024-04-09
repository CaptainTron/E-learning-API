const DBConfig = require("../db/mysql")
const users = DBConfig.users



// This Function Will Register user 
const Register_newCustomer = async (req, res) => {
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

const view_user = async (req, res) => {
    try {
        const { phone_number } = req.params
        if (!phone_number) {
            res.status(400).json({ message: "Invalid Request", status: "Missing Required Parameters" })
            return;
        }
        let new_user = await users.findOne({ phone_number })
        res.status(200).json({ status: "Successful", new_user })
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: "Phone Number Already taken!", errorType: err.name })
        } else {
            res.status(500).json({ message: "Internal Server Error", errorType: err.name })
        }
    }
}

const update_user = async (req, res) => {
    try {
        const { email, first_name, last_name, phone_number } = req.body
        if (!phone_number) {
            res.status(400).json({ message: "Invalid Request", status: "Missing Required Parameters" })
            return;
        }
        let Updated_users = await users.update({ email, first_name, last_name }, { where: { phone_number }, returning: true })
        res.status(201).json({ status: "Successful", Updated_users })
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: "Phone Number Already taken!", errorType: err.name })
        } else {
            res.status(500).json({ message: "Internal Server Error", errorType: err.name })
        }
    }
}


module.exports = {
    Register_newCustomer,
    view_user,
    update_user,

}