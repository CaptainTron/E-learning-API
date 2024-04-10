const router = require('express').Router()


const { register_user, view_user, update_user, Register_course,
    get_registered_courses } = require('../Controller/user_controller.js')

router.post('/register-user', register_user)
router.get('/user-view', view_user)
router.patch('/update-user', update_user)
router.post('/register-course', Register_course)
router.get('/view-registered-course', get_registered_courses)

module.exports = router   