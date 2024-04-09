const DBConfig = require("../db/mysql")
const courses = DBConfig.courses
const sequelize = DBConfig.sequelize

const CreateCourses = async (req, res) => {
    try {
        const { category, level, price, name, duration } = req.body;
        if (!category || !level || !price || !name || !duration) {
            res.status(400).json({ message: "Invalid Request", status: "Missing Required Parameters" })
            return;
        }

        let course = await courses.create({ ...req.body })
        res.status(201).json({ status: "Successful", course })
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ message: "Invalid Request", status: "Something Went Wrong.. :(" })
        return;
    }
}

const get_Courses = async (req, res) => {
    try {
        const { category, level, price, name, duration } = req.query;
        const { limit } = req.query;
        let limitquery = limit ? limit : undefined

        // if (!category || !level || !price || !name || !duration) {
        //     res.status(400).json({ message: "Invalid Request", status: "Missing Required Parameters" })
        //     return;
        // }

        let course = await courses.findAll({ limit: limitquery, order: sequelize.col('duration'), }, { where: { name } })
        res.status(201).json({ status: "Successful", course })
    } catch (err) {
        console.log(err.message)
        res.status(400).json({ message: "Invalid Request", status: "Something Went Wrong.. :(" })
        return;
    }
}

const update_course = async (req, res) => {
    try {
        const { category, level, price, name, duration } = req.body
        // if (!category || !level || !price || !name || !duration) {
        //     res.status(400).json({ message: "Invalid Request", status: "Missing Required Parameters" })
        //     return;
        // }
        let Updated_course = await courses.update({ category, level, price, duration }, { where: { name }, returning: true })
        res.status(201).json({ status: "Successful", Updated_course })
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: "Phone Number Already taken!", errorType: err.name })
        } else {
            res.status(500).json({ message: "Internal Server Error", errorType: err.name })
        }
    }
}

const delete_course = async (req, res) => {
    try {
        const { name } = req.params

        if (!name) {
            res.status(400).json({ message: "Invalid Request", status: "Missing name Parameter" })
            return;
        }

        let Updated_course = await courses.destroy({ where: { name }, returning: true })
        res.status(201).json({ status: "Successfully Deleted", Updated_course })
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: "Internal Server Error", errorType: err.name })
    }
}


module.exports = {
    CreateCourses,
    get_Courses,
    update_course,
    delete_course
}