// workers/customerWorker.js
const cust = require("../db/mysql");
const Customer = cust.register

// Function to ingest customer data from Excel file
const Customer_data = async (req, res) => {
  try {
    // console.log(req.body)
    let customer_data, status = "fetching from Request:) customer data"
    customer_data = req.body
    if (Object.keys(customer_data).length === 0) {
      customer_data = require('../data/customer_data.json') 
      status = "No JSON data provided in request body, Fetched from Existing customer... "
    }
    await Customer.bulkCreate(customer_data);
    res.status(200).json({ message: "customer_data Successfully Pushed :)", status })
  } catch (error) {
    console.error('Error ingesting loan_data:', error);
    res.status(400).json({ message: "Can not ingest again, duplicate key Found!", status: "duplicate key found in data!!" })
  }
};  

module.exports = { Customer_data };
