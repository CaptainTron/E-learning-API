const DBConfig = require("../db/mysql")
const { Op } = require('sequelize');
const courses = DBConfig.courses
const sequelize = DBConfig.sequelize


// Create Courses
const CreateCourses = async (req, res) => {
    try {
        const { category, level, price, name, duration, Ratings, certification, pre_requisites, instructor, description } = req.body;
        if (!category || !level || !price || !name || !duration || !Ratings || !certification || !instructor || !description) {
            res.status(400).json({ message: "Invalid Request", status: "Missing Required Parameters" })
            return;
        }

        let course = await courses.create({ ...req.body })
        res.status(201).json({ status: "Successful", course })
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: "Course Already Available!", errorType: err.name })
        } else {
            res.status(500).json({ message: "Internal Server Error", errorType: err.name })
        }
    }
}

// View Courses
const get_Courses = async (req, res) => {
    try {
        // Destructure query parameters
        const { category, level, price, name, duration, minPrice, maxPrice, instructor } = req.query;
        let { limit } = req.query; // Destructure limit separately

        // Set default limit if not provided
        let limitQuery = limit ? parseInt(limit) : 10;

        // Build query conditions dynamically based on provided parameters
        let whereClause = {};

        if (category) whereClause.category = category;
        if (level) whereClause.level = level;
        if (name) whereClause.name = { [Op.like]: `%${name}%` }; // Use 'like' operator for partial name match
        if (duration) whereClause.duration = duration;
        if (instructor) whereClause.instructor = instructor;

        // Add price filtering if minPrice or maxPrice is provided
        if (minPrice || maxPrice) {
            whereClause.price = {}; // Initialize price filter object

            // Apply 'greater than' condition if minPrice is provided
            if (minPrice) whereClause.price[Op.gt] = parseFloat(minPrice);

            // Apply 'less than' condition if maxPrice is provided
            if (maxPrice) whereClause.price[Op.lt] = parseFloat(maxPrice);
        }

        // Fetch courses based on the constructed query conditions
        let courses_list = await courses.findAll({
            limit: limitQuery,
            order: [['duration', 'ASC']], // Sort by duration in ascending order
            where: whereClause // Apply dynamic where conditions
        });

        // Return successful response with fetched courses
        res.status(200).json({ status: "Successfull", courses_list });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Internal Server Error", status: "Something Went Wrong.. :(" });
    }
}

// Update Courses
const update_course = async (req, res) => {
    try {
        const { category, level, price, name, duration, Ratings, certification, pre_requisites, instructor, description, tags } = req.body;

        // Check if the 'name' parameter is missing
        if (!name) {
            res.status(400).json({ message: "Invalid Request", status: "Missing 'name' Parameter" });
            return;
        }

        // Check if a course with the provided name exists
        const existingCourse = await courses.findOne({ where: { name } });
        if (!existingCourse) {
            res.status(400).json({ message: "Invalid Request", status: "This Course Does not Exist" });
            return;
        }

        // Update the course details
        const updated_course = await courses.update(
            { category, level, price, name, duration, Ratings, certification, pre_requisites, instructor, description, tags },
            { where: { name }, returning: true }
        );

        res.status(200).json({ status: "Successfull", updated_course });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Internal Server Error", errorType: err.name });
    }
};


// Delete A particular Course
const delete_course = async (req, res) => {
    try {
        const { name, course_id } = req.params

        if (!name || !course_id) {
            res.status(400).json({ message: "Invalid Request", status: "Missing required parameters" })
            return;
        }

        const existingCourse = await courses.findOne({ where: { name, course_id } });
        if (!existingCourse) {
            res.status(400).json({ message: "Invalid Request", status: "This Course Does not Exist" });
            return;
        }

        let Updated_course = await courses.destroy({ where: { name, course_id }, returning: true })
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