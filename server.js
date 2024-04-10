const express = require("express");
const app = express()
const cors = require('cors');
app.use(cors());
require('dotenv').config();
app.use(express.json());

const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
// const logger = require('./logger');


// Fetch list of all the course!!
const DBConfig = require("./db/mysql")
const { Op } = require('sequelize');
const coursess = DBConfig.courses
app.get('/v1/view/courses', async (req, res) => {
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
        let courses_list = await coursess.findAll({
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
})




// create ccount or JWTTOKEN
const authrouter = require('./Router/credentials.js')
app.use('/v1', authrouter)


// Create a stream object with a 'write' function that will be used by morgan
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), { flags: 'a' });
// Setup morgan middleware to log HTTP requests
app.use(morgan('combined', { stream: accessLogStream }));



const { User_Authorization, Superadmin_Authorization } = require('./middleware/authenticate.js')

// SuperUser_Router
const courses = require('./Router/superuser_router.js')
app.use('/v1', Superadmin_Authorization, courses);

// UserAUthorisation
const user = require('./Router/user_router.js')
app.use('/v1', User_Authorization, user);



const PORT = 5000;
const StartServer = async () => {
    try {
        app.listen(PORT, console.log(`Server is Listening on PORT...... ${PORT}`))
    } catch (err) {
        console.log(err.message);
    }
}
StartServer();

