const DBConfig = require("../db/mysql")
const { Op } = require('sequelize');
const courses = DBConfig.courses
const superCred = DBConfig.superCredentials


// createaccount
const createSuper_account = async (req, res) => {
    try {
        const { password, email, re_password, first_name, phone_number, last_name } = req.body
        if (!email || password != re_password || !first_name || !phone_number || !last_name) {
            res.status(400).json({ message: "Invalid Request", status: "Mission required parameters!" })
            return;
        }

        const existing = await superCred.findOne({ where: { email } });
        if (existing) {
            res.status(400).json({ message: "Invalid Request", status: "This User Already Exist" });
            return;
        }

        let new_superuser = await superCred.create({ ...req.body })
        res.status(201).json({
            status: "Successfull", new_superuser: {
                email: new_superuser.email,
                super_id: new_superuser.super_id,
                first_name: new_superuser.first_name,
                last_name: new_superuser.last_name,
                phone_number: new_superuser.phone_number

            }, mesage: "Phone Number can not be Changed!"
        })
    } catch (err) {
        console.log(err.message)
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: "Phone Number Already taken!", errorType: err.name })
        } else {
            res.status(500).json({ message: "Invalid Phone Number!", errorType: err.name })
        }
    }
}


const superlogin = async (req, res) => {
    try {
        const { password, email } = req.body
        if (!password || !email) {
            res.status(400).json({ message: "Invalid Request", status: "this request not valid!" })
            return;
        }

        const existing = await superCred.findOne({ where: { email } });
        if (existing) {
            const IsPasswordMatch = await existing.comparePasswords(password);
            if (IsPasswordMatch) {
                // This Will generate Unique JWT Token for the User
                const JWTToken = existing.createJWT(password);
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
            res.status(400).json({ message: "Course with given name already Available!", errorType: err.name })
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
        const { category, level, price, duration, Ratings, certification, pre_requisites, instructor, description, tags } = req.body;
        const { course_id } = req.params;
        // Check if the 'name' parameter is missing
        if (!course_id) {
            res.status(400).json({ message: "Invalid Request", status: "Missing 'course_id' query Parameter", note: "Course Name cannot be changed!" });
            return;
        }

        // Check if a course with the provided name exists
        const existingCourse = await courses.findOne({ where: { course_id } });
        if (!existingCourse) {
            res.status(400).json({ message: "Invalid Request", status: "This Course Does not Exist", note: "Course Name cannot be changed!" });
            return;
        }

        // Update the course details
        const updated_course = await courses.update(
            { category, level, price, duration, Ratings, certification, pre_requisites, instructor, description, tags },
            { where: { course_id }, returning: true }
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
        res.status(200).json({ status: "Successfully Deleted", Updated_course })
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: "Internal Server Error", errorType: err.name })
    }
}



module.exports = {
    CreateCourses,
    get_Courses,
    update_course,
    delete_course,

    createSuper_account,
    superlogin
}