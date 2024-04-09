const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config()
// Connect to PostgreSQL database
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const sequelize = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
    dialect: 'postgres',
    host: PGHOST,
    port: 5432,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    ssl: true,
    define: {
        timestamps: false // If you want to disable timestamps globally
    },
    logging: false

});
// Test the connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to POSTGRES has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
    }
})();

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// dataAlready present!
// db.Customer = require("../models/customer_info.js")(sequelize, DataTypes); 
// db.Customer_loans = require("../models/Customer_loan.js")(sequelize, DataTypes);

db.users = require("../models/users.js")(sequelize, DataTypes);
db.courses = require("../models/courses.js")(sequelize, DataTypes);
db.course_registered = require("../models/course_registered.js")(sequelize, DataTypes);

db.sequelize.sync({ force: false })
    .then(() => console.log("Re-Sync Successful"))

module.exports = db;
