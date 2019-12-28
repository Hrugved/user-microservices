const router = require('express').Router()
const user = require('../controllers/userController')

router.get('/ping', (req,res) => res.send('pong'))


router.get('/send_verificaton', user.sendVerificationEmail)

router.get('/check_verification', user.verifyEmail)

router.post('/send_reset_password', user.sendResetPasswordEmail)

module.exports = router