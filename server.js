const express = require("express");
const app = express()
const cors = require('cors');
app.use(cors());
require('dotenv').config();
app.use(express.json());

// This one for Service Workers
// Service Worker to Inject Data directly to database 
// const serviceworder = require("./Courses.js/serviceWorker_Router.js")
// app.use('/v1', serviceworder)


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

