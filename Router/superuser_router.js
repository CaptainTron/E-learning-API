const router = require('express').Router()


const { CreateCourses, delete_course, update_course } = require('../Controller/superUser_controller.js')

router.post('/createcourses', CreateCourses)
router.delete('/delete-course/:name/:course_id', delete_course)
router.patch('/update-course/:course_id', update_course)






module.exports = router