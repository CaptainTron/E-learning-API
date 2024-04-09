const express = require("express");
const app = express()
const cors = require('cors');
app.use(cors());
require('dotenv').config();
app.use(express.json());

const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');


// Create a stream object with a 'write' function that will be used by morgan
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), { flags: 'a' });

// Setup morgan middleware to log HTTP requests
app.use(morgan('combined', { stream: accessLogStream }));

const router = require('./Router/course_router.js') 
app.use('/v1', router);


const user = require('./Router/user_router.js') 
app.use('/v1', user);

 
const register_course = require('./Router/register_course.js') 
app.use('/v1', register_course);

const PORT = 5000;
const StartServer = async () => {
    try {
        app.listen(PORT, console.log(`Server is Listening on PORT...... ${PORT}`))
    } catch (err) {
        console.log(err.message);
    }
}
StartServer();

