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


const router = require('./Router/coursesRouter.js') 
app.use('/v1', router);


// const router = require('./Router/UserRouter.js') 
// app.use('/v1', router);

const PORT = 5000;
const StartServer = async () => {
    try {
        app.listen(PORT, console.log(`Server is Listening on PORT...... ${PORT}`))
    } catch (err) {
        console.log(err.message);
    }
}
StartServer();

