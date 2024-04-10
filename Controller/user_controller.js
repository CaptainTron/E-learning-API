const DBConfig = require("../db/mysql")
const users = DBConfig.users
const course_registered = DBConfig.course_registered
const courses = DBConfig.courses
const sequelize = DBConfig.sequelize

const { sendmail } = require("../email.js")

// const credentials = DBConfig.userCredentials

// This Function Will Register user 
const register_user = async (req, res) => {
    try {
        const { email, first_name, last_name, phone_number, password, re_password } = req.body
        if (!email || !first_name || !last_name || !phone_number || password != re_password) {
            res.status(400).json({ message: "Invalid Request", status: "this request not valid!" })
            return;
        }

        const existing = await users.findOne({ where: { email, phone_number } });
        if (existing) {
            res.status(400).json({ message: "Invalid Request", status: "This email or phone_number Already taken!" });
            return;
        }
        sendmail(email, `Hello, ${first_name} Welcome You've been successfully Registered!`)

        let newUser = await users.create({ ...req.body })
        res.status(201).json({
            status: "Successfull", newUser: {
                user_id: newUser.user_id,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                phone_number: newUser.phone_number,
                email: newUser.email
            }, mesage: "email can not be Changed!"
        })
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: "Internal Server Error", errorType: err.name })
    }
}

const userlogin = async (req, res) => {
    try {
        const { password, email } = req.body
        if (!email || !password) {
            res.status(400).json({ message: "Invalid Request", status: "this request not valid!" })
            return;
        }

        const existing = await users.findOne({ where: { email } });
        if (existing) {
            const IsPasswordMatch = await existing.comparePasswords(password);
            if (IsPasswordMatch) {
                // This Will generate Unique JWT Token for the User
                const JWTToken = existing.createJWT(password);
                sendmail(email, `Hello, ${existing.first_name} Login detected!`)
                res.status(200).json({ status: "Successful", message: "You've successfully Signed In!", TOKEN: JWTToken })
                return;
            }
        }

        res.status(404).json({ status: "Not found", mesage: "No user Found!" })
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: "Internal Server Error", errorType: err.name })
    }
}


// view user
const view_user = async (req, res) => {
    try {
        const user_id = req.user.user_id
        console.log(req.user)
        let user = await users.findOne({ where: { user_id } })
        res.status(200).json({ status: "Successful", user })
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: "Internal Server Error", errorType: err.name })
    }
}

// update_user
const update_user = async (req, res) => {
    try {
        const { email, first_name, last_name, phone_number } = req.body
        const user_id = req.user.user_id

        const existing = await users.findOne({ where: { user_id } });
        if (!existing) {
            res.status(400).json({ message: "Invalid Request", status: "This User Does not Exist" });
            return;
        }

        let updated_user = await users.update({ email, first_name, last_name, phone_number }, { where: { user_id }, returning: true })
        sendmail(req.user.email, `Hello, ${req.user.firstName} Profile has been successfully updated!!`)
        res.status(201).json({ status: "Successfull", updated_user, mesage: "Phone Number can not be Updated!" })
    } catch (err) {
        console.log(err.message)
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: "Phone Number Already taken!", errorType: err.name })
        } else {
            res.status(500).json({ message: "Internal Server Error", errorType: err.message })
        }
    }
}

// This Function Will Register user 
const Register_course = async (req, res) => {
    try {
        const { course_id } = req.body
        const user_id = req.user.user_id
        if (!course_id) {
            res.status(400).json({ message: "Invalid Request", status: "Missing Required Parameters" })
            return;
        }

        const existingCourse = await courses.findOne({ where: { course_id } });
        if (!existingCourse) {
            res.status(400).json({ message: "Invalid Request", status: "This Course Does not Exist" });
            return;
        }

        const existing = await users.findOne({ where: { user_id } });
        if (!existing) {
            res.status(400).json({ message: "Invalid Request", status: "This User Does not Exist" });
            return;
        }

        // console.log(sendmail('vaibhavwateam@gmail.com', "Hiill") )

        let new_registration = await course_registered.create({ user_id, course_id })
        res.status(201).json({ status: "Successful", new_registration })
        sendmail(req.user.email, `Hello, ${req.user.firstName} Welcome You've been registered to Course ID: ${course_id}, view your dashboard!`)
    } catch (err) {
        console.log(err.message)
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: "Course Already Registered!", errorType: err.name })
        } else {
            res.status(500).json({ message: "Internal Server Error", errorType: err.name })
        }
    }
}

const get_registered_courses = async (req, res) => {
    try {
        const { limit } = req.query;
        let limitquery = limit ? limit : 5
        const user_id = req.user.user_id

        let courses = await course_registered.findAll({ limit: limitquery, order: sequelize.col('registered_on'), include: [{ model: sequelize.models.courses }] }, { where: { user_id } })
        res.status(201).json({ status: "Successful", courses })
    } catch (err) {
        console.log(err.message)
        res.status(400).json({ message: "Invalid Request", status: "Something Went Wrong.. :(" })
    }
}


module.exports = {
    register_user,
    userlogin,

    view_user,
    update_user,

    Register_course,
    get_registered_courses
}