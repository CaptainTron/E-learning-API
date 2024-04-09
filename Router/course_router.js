const router = require('express').Router()


const { CreateCourses, get_Courses, delete_course, update_course } = require('../Controller/course_controller.js')

router.post('/createcourses', CreateCourses)
router.get('/course', get_Courses)
router.delete('/delete-course/:name/:course_id', delete_course)
router.patch('/update-course/:name', update_course)



module.exports = router