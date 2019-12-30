const router = require('express').Router()
const auth = require('../controllers/authController')
const user = require('../controllers/userController')
const requestFeeder = require('../helpers/requestFeeder')

router.use(requestFeeder)

router.get('/ping', (req,res) => res.send('pong'))

// signup
router.post('/', user.register)

router.post('/verification', user.verifyOtp)

module.exports = router