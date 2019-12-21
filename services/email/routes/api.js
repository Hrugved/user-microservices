const router = require('express').Router()
const user = require('../controllers/userController')

router.post('/ping', (req,res) => res.send('pong'))

// login
router.post('/verification', user.sendVerificationMail)

router.post('/reset_password', user.sendResetPasswordMail)

module.exports = router