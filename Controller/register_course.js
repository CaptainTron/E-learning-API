const DBConfig = require("../db/mysql")
const course_registered = DBConfig.course_registered
const users = DBConfig.users
const courses = DBConfig.courses
const sequelize = DBConfig.sequelize

const { sendmail } = require('../email')

// This Function Will Register user 
const Register_course = async (req, res) => {
    try {
        const { user_id, course_id } = req.body

        if (!user_id || !course_id) {
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

        console.log(sendmail('vaibhavwateam@gmail.com', "Hiill")) 

        let new_user = await course_registered.create({ ...req.body })
        res.status(201).json({ status: "Successful", new_user })
    } catch (err) {
        console.log(err.message)
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: "Course Already Registered!", errorType: err.name })
        } else {
            res.status(500).json({ message: "Internal Server Error", errorType: err.name })
        }
    }
}

// This Function Will Register user 
const get_registered_courses = async (req, res) => {
    try {
        const { limit, user_id } = req.query;
        let limitquery = limit ? limit : 5
        if (!user_id) {
            res.status(400).json({ message: "Invalid Request", status: "Missing user_id Parameter" })
            return;
        }

        let courses = await course_registered.findAll({ limit: limitquery, order: sequelize.col('registered_on'), include: [{ model: sequelize.models.courses }] }, { where: { user_id } })
        res.status(201).json({ status: "Successful", courses })
    } catch (err) {
        console.log(err.message)
        res.status(400).json({ message: "Invalid Request", status: "Something Went Wrong.. :(" })
    }
}

module.exports = {
    Register_course,
    get_registered_courses

}