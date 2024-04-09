const router = require('express').Router()


const { Register_newCustomer } = require('../Controller/user_controller.js')

router.post('/register-user', Register_newCustomer)
// router.get('/course/:name', get_Courses)
// router.delete('/delete-course/:name', delete_course)
// router.patch('/update-course/:name', update_course)


 
module.exports = router