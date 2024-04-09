// workers/customerloansWorker.js
const cust = require("../db/mysql");
const loans = cust.loans

// Function to ingest customer Loans data from Excel file
const CustomerLoans = async (req, res) => {
  try {
    // const loan_data = require('../data/loan_data.json')
    let loan_data, status = "fetching from existing loans data"
    loan_data = req.body
    if (Object.keys(loan_data).length === 0) {
      loan_data = require('../data/loan_data.json')
      console.log("No JSON data provided in request body, Fetched from Existing file... ")
      status = "No JSON data provided in request body, Fetched from Existing loan_data... "
    }
    await loans.bulkCreate(loan_data);
    res.status(200).json({ status, message: "loan_data Successfully Injected!" })
  } catch (error) {
    console.error('Error ingesting loan_data:', error);
    res.status(400).json({ message: "Can not ingest again, duplicate key Found!", status: "duplicate key found in data!!" })
  }
};

module.exports = { CustomerLoans };
