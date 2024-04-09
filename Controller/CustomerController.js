const DBConfig = require("../db/mysql")
const users = DBConfig.users

const { calculateCreditScore,
    updatePaymentDetails,
    calculateEMI,
    calculateTimePeriod }
    = require("./CalculateCustomer")



// This Function Will Register user 
const Register_newCustomer = async (req, res) => {
    try {
        const { email, first_name, last_name, phone_number } = req.body
        if (!email || !first_name || !last_name || !phone_number) {
            res.status(400).json({ message: "Invalid Request", status: "Missing Required Parameters" })
            return;
        }
        let new_user = await users.create({ ...req.body })
        res.status(201).json({ status: "Successful", new_user })
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: "Phone Number Already taken!", errorType: err.name })
        } else {
            res.status(500).json({ message: "Internal Server Error", errorType: err.name })
        }
    }
}

const view_user = async (req, res) => {
    try {
        const { phone_number } = req.params
        if (!phone_number) {
            res.status(400).json({ message: "Invalid Request", status: "Missing Required Parameters" })
            return;
        }
        let new_user = await users.findOne({ phone_number })
        res.status(200).json({ status: "Successful", new_user })
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: "Phone Number Already taken!", errorType: err.name })
        } else {
            res.status(500).json({ message: "Internal Server Error", errorType: err.name })
        }
    }
}

const update_user = async (req, res) => {
    try {
        const { email, first_name, last_name, phone_number } = req.body
        if (!phone_number) {
            res.status(400).json({ message: "Invalid Request", status: "Missing Required Parameters" })
            return;
        }
        let Updated_users = await users.update({ email, first_name, last_name }, { where: { phone_number }, returning: true })
        res.status(201).json({ status: "Successful", Updated_users })
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: "Phone Number Already taken!", errorType: err.name })
        } else {
            res.status(500).json({ message: "Internal Server Error", errorType: err.name })
        }
    }
}


const check_eligibility = async (req, res) => {
    const { customer_id, loan_amount, interest_rate, tenure } = req.body;
    if (!customer_id || !loan_amount || !interest_rate || !tenure) {
        res.status(400).json({ message: "Invalid Request", status: "Missing Required Parameters" })
        return;
    }
    let customer = await register.findOne({ where: { customer_id } })
    if (customer == null) {
        res.status(404).json({ message: "No Customer found with given Id", status: "Not found!" })
        return;
    }
    let creditScore = 0;
    if (customer.approved_limit < loan_amount) {
        creditScore = 0;
    } else {
        creditScore = await calculateCreditScore(customer_id, customer?.monthly_income ? customer.monthly_income : 0, customer.approved_limit, loan_amount);
    }
    console.log(creditScore)

    let approval = false;
    let corrected_interest_rate = interest_rate;
    let monthly_installment = calculateEMI(loan_amount, interest_rate, tenure);

    if (creditScore > 50) {
        approval = true;
    } else if (creditScore > 30) {
        if (interest_rate <= 12) {
            corrected_interest_rate = 12;
        }
        approval = true;
    } else if (creditScore > 10) {
        if (interest_rate <= 16) {
            corrected_interest_rate = 16;
        }
        approval = true;
    }

    // Send response
    res.status(200).json({
        status: {
            customer_id,
            approval,
            interest_rate,
            corrected_interest_rate,
            tenure,
            monthly_installment
        }
    })
}


const create_loan = async (req, res) => {
    try {
        const { customer_id, loan_amount, interest_rate, tenure } = req.body;
        let loanApproved = false
        let monthly_installment = 0;
        let loanDetails;
        let creditScore = 0
        let loan_approved = loan_amount
        let responseBody;
        let corrected_interest_rate = interest_rate;
        let approval = false;

        // Check if elegible or not!!
        let customer = await register.findOne({ where: { customer_id } })
        if (customer == null) {
            res.status(404).json({ status: "Customer not found!", message: "First Register yourself via registration!" })
            return;
        }
        if (customer.approved_limit < loan_approved) {
            creditScore = 0;
        } else {
            creditScore = await calculateCreditScore(customer_id, customer?.monthly_income ? customer.monthly_income : 0, customer.approved_limit, loan_amount);
        }

        if (creditScore > 50) {
            approval = true;
        } else if (creditScore > 30) {
            if (interest_rate <= 12) {
                corrected_interest_rate = 12;
            }
            approval = true;
        } else if (creditScore > 10) {
            if (interest_rate <= 16) {
                corrected_interest_rate = 16;
            }
            approval = true;
        }


        if (approval) {
            loanApproved = true;
            let remaining_amount = loan_amount, EMIs_paid_on_Time = 0
            message = 'Loan approved';
            const { start_date, end_date } = calculateTimePeriod(tenure);
            // console.log(String(start_date), String(end_date))
            let interest_rate = corrected_interest_rate
            monthly_installment = calculateEMI(loan_approved, interest_rate, tenure);
            loanDetails = await loans.create({
                customer_id,
                monthly_installment,
                tenure,
                interest_rate,
                loan_approved,
                EMIs_paid_on_Time,
                start_date: String(start_date),
                end_date: String(end_date)
            })

            responseBody = { ...loanDetails.dataValues, loanApproved, message, message: "Interest Rate, might be changed!" }
        } else {
            message = 'Loan not approved. Customer does not meet eligibility criteria.';
            responseBody = { message, loanApproved, customer_id }
        }

        res.status(loanApproved ? 201 : 409).json({
            status: responseBody
        })
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ status: 'Something Went Wrong' })

    }
}

// View Loans goes here...
const view_loan = async (req, res) => {
    try {
        const loan_id = req.params.loan_id;

        const loan = await loans.findOne({ where: { loan_id: loan_id } })
        if (loan === null) {
            res.status(404).json({ status: "No Loan Found!" })
            return;
        }
        let customer_id = loan.dataValues.customer_id
        const { first_name, last_name, age, phone_number } = await register.findOne({ customer_id });

        // Send response
        res.status(loan ? 200 : 400).json({ status: { ...loan.dataValues, customerDetails: { first_name, last_name, age, phone_number, customer_id } } })
    } catch (err) {
        console.log(err.message)
        res.status(400).json({ status: 'Invalid Input' })
    }
}

const make_payment = async (req, res) => {
    try {
        // Extract customer_id and loan_id from request parameters
        const { customer_id, loan_id } = req.params;

        // Extract payment amount from request body
        const paymentAmount = req.body.payment_amount;

        // Fetch loan details from the database based on loan_id (pseudo-code)
        let loanDetails = await loans.findOne({ where: { loan_id, customer_id } });
        loanDetails = loanDetails.dataValues
        if (loanDetails.loan_completed) {
            res.status(200).json({ status: "Completed", message: 'Loan amount completed' });
            return
        }
        // Calculate the total amount due for all remaining EMIs
        const totalDueAmount = loanDetails.loan_approved - loanDetails.amount_paid;

        // Check if the payment amount is less than or equal to the total due amount
        let isCompleted = false
        if (paymentAmount <= totalDueAmount) {
            // Calculate remaining amount after payment
            let remainingAmount = totalDueAmount - paymentAmount
            let amount_paid = loanDetails.amount_paid + paymentAmount
            if (loanDetails.loan_approved === amount_paid) { isCompleted = true }
            updatePaymentDetails(amount_paid, loan_id, isCompleted, loanDetails.EMIs_paid_on_Time);
            // Send success response with remaining amount
            res.status(200).json({ success: true, remaining_amount: remainingAmount, isCompleted: isCompleted });
        }
        else {
            // Payment amount exceeds total due amount, send error response
            res.status(400).json({ success: false, error: 'Payment amount exceeds total due amount' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const view_statement = async (req, res) => {
    // Extract customer_id and loan_id from request parameters
    try {
        const customer_id = req.params.customer_id;
        const loan_id = req.params.loan_id;
        let loanDetails;

        // Fetch loan details from the database based on customer_id and loan_id (pseudo-code)
        try {
            loanDetails = await loans.findOne({ where: { customer_id, loan_id } });
            loanDetails = loanDetails.dataValues
        } catch (err) {
            res.status(404).json({ message: "No One found with given loan_id and customer_id" });
            return;
        }

        let amount_paid = loanDetails.amount_paid
        let loan_completed = loanDetails.loan_completed
        // Check if loan details exist
        if (loanDetails) {
            // Construct response body with loan details
            let repayments_left = parseInt(loanDetails.tenure) - parseInt(loanDetails.EMIs_paid_on_Time)
            let status = "Loan Pending!"
            if (loan_completed) {
                repayments_left = 0;
                status = "Loan Completed!"
            }
            const responseBody = {
                customer_id: loanDetails.customer_id,
                loan_id: loanDetails.loan_id,
                principal: loanDetails.loan_amount,
                interest_rate: loanDetails.interest_rate,
                amount_paid: amount_paid,
                monthly_installment: loanDetails.monthly_installment,
                repayments_left, // Calculate remaining EMIs
                loan_completed,
                status
            };
            // Send response with statement of the particular loan
            res.status(200).json(responseBody);
        } else {
            // Loan details not found, send error response
            res.status(404).json({ error: 'Loan details not found' });
        }
    } catch (err) {
        res.status(500).json({ message: "Something Went Wrong!", err: err.message });
    }
}



module.exports = {
    Register_newCustomer,
    view_user,
    update_user,

    check_eligibility,
    create_loan,
    view_loan,
    make_payment,
    view_statement
}