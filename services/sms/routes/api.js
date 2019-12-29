const router = require('express').Router()
const user = require('../controllers/userController')

router.get('/ping', (req,res) => res.send('pong'))

router.get('/send_otp', user.sendOtp)

router.get('/verify_otp', user.verifyOtp)

module.exports = router