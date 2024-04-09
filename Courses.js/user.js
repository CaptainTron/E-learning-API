const router = require('express').Router()
const { Register_newCustomer,
    check_eligibility,
    create_loan,
    view_loan,
    make_payment,
    view_user,
    update_user,
    view_statement } = require('../Controller/user_controller');

router.post('/user-register', Register_newCustomer);
router.get('/user-view/:phone_number', view_user);
router.post('/user-update', update_user);


router.post('/check-eligibility', check_eligibility);
router.post('/create-loan', create_loan); 
router.post('/make-payment/:customer_id/:loan_id', make_payment);
router.get('/view-loan/:loan_id', view_loan);
router.get('/view-statement/:customer_id/:loan_id', view_statement);

module.exports = router