const router = require('express').Router()


const { register_user, userlogin } = require('../Controller/user_controller.js')
const { createSuper_account,
    superlogin } = require('../Controller/superUser_controller.js')

router.post('/user/createaccount', register_user)
router.post('/user/login', userlogin)

router.post('/admin/createaccount', createSuper_account)
router.post('/admin/login', superlogin)


module.exports = router  