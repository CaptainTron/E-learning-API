const router = require('express').Router()


const { register_user, view_user, update_user } = require('../Controller/user_controller.js')

router.post('/register-user', register_user)
router.get('/user-view/:phone_number', view_user)
router.patch('/update-user', update_user)



module.exports = router  