const router = require('express').Router()
const auth = require('../controllers/authController')
const user = require('../controllers/userController')
const requestFeeder = require('../helpers/requestFeeder')

router.use(requestFeeder)

router.post('/ping', (req,res) => res.send('pong'))

// signup
router.post('/', user.register)

// get user
router.get('/', user.verifyUser)

// email verification
router.get('/verification', user.emailVerification)

// authorize user
router.get('/authorize', auth.getToken)

// verify user
router.get('/verify', auth.verifyToken)

module.exports = router