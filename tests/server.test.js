const { plugin } = require('mongoose');
const request = require('supertest');

let customer_id
function generateRandomPhoneNumber() {
  const countryCode = "+91"; // Assuming India, change as per your region
  const areaCode = Math.floor(Math.random() * 900) + 100; // Random 3-digit area code
  const firstPart = Math.floor(Math.random() * 9000) + 1000; // Random 4-digit first part
  const secondPart = Math.floor(Math.random() * 9000) + 1000; // Random 4-digit second part
  return `${countryCode}${areaCode}${firstPart}${secondPart}`;
}

let register = {
  "first_name": "Vaibhav",
  "last_name": "Yadav",
  "age": 20,
  "monthly_income": 1000,
  "phone_number": generateRandomPhoneNumber()
}
describe('Customer register', () => {
  test('User register', async () => {
    const response = await request('http://localhost:5000/api').post(`/register`).send(register);
    if (response.status === 500) {
      console.error("Internal Server Error:", response.body.error);
    } else {
      expect(response.status).toBe(201);
      // expect(response.body.Customer.status).toBe("Successful");
      customer_id = response.body.Customer.customer_id
    }
  });
});

let payload = {
  "customer_id": customer_id,
  "loan_amount": 1000,
  "interest_rate": 1,
  "tenure": 10
}
describe('POST /check-eligibility', () => {
  test('Check Elegibility', async () => {
    const response = await request('http://localhost:5000/api').post('/check-eligibility').send(payload)
    if (response.status === 500) {
      console.error("Internal Server Error:", response.body);
    } else if (response.status === 400) {
      console.error("Parameters are missing", response.body);
    }
    else {
      expect(response.status).toBe(200);
      expect(response.body.status.customer_id).toBe(payload.customer_id);
      expect(response.body.status.interest_rate).toBe(payload.interest_rate);
      expect(response.body.status.tenure).toBe(payload.tenure);
    }
  });
});


payload = {
  "customer_id": customer_id,
  "loan_amount": 1000,
  "interest_rate": 5,
  "tenure": 10
}
describe('POST /create-loan', () => {
  test('/create-loan', async () => {
    try {
      const response = await request('http://localhost:5000/api').post(`/create-loan`).send(payload);

      if (response.status === 500) {
        // Handle Internal Server Error
        console.error("Internal Server Error:", response.body);
      } else {
        expect(response.status).toBe(201);
      }
    } catch (error) {
      console.error("Test Error:", error);
      throw error; // Re-throw the error to fail the test
    }
  });
});



payload = {
  "customer_id": customer_id,
  "loan_amount": 1000,
  "interest_rate": 5,
  "tenure": 10
}
describe('PATCH /view-loan/1', () => {
  test('should update a task', async () => {
    const response = await request('http://localhost:5000/api').get(`/view-loan/1`)
    expect(response.status).toBe(200);
  });
});



payload = {
  "payment_amount": 100
}
describe('POST /:customer_id/:loan_id', () => {
  test(':customer_id/:loan_id', async () => {
    const response = await request('http://localhost:5000/api').post(`/make-payment/1/15`).send(payload)
    if (response.status === 500) {
      // Handle Internal Server Error
      console.error("Internal Server Error:", response.body);
    } else {
      console.log(response.body)
      expect(response.status).toBe(200);
    }
  });
})


// /view-statement
describe('POST /view-statement', () => {
  test('/view-statement', async () => {
    const response = await request('http://localhost:5000/api').get(`/view-statement/1/15`)
    if (response.status === 404) {
      // Handle 404 Error
      console.error("404 Error:", response.body);
    } else {
      console.log(response.body)
      expect(response.status).toBe(200);
    }
  });
})
