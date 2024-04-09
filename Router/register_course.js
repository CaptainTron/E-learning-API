const router = require('express').Router()


const { Register_course, get_registered_courses } = require('../Controller/register_course.js')

router.post('/register-course', Register_course)
router.get('/view-registered-course', get_registered_courses)
// router.delete('/delete-course/:name', delete_course)
// router.patch('/update-course/:name', update_course)


 
module.exports = router