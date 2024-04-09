const router = require('express').Router()


const { CreateCourses, get_Courses, delete_course, update_course } = require('../Controller/CourseController.js')

router.post('/createcourses', CreateCourses)
router.get('/course/:name', get_Courses)
router.delete('/delete-course/:name', delete_course)
router.patch('/update-course/:name', update_course)


 
module.exports = router