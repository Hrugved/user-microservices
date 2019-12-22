const router = require('express').Router()
const auth = require('../controllers/authController')
const user = require('../controllers/userController')
const requestFeeder = require('../helpers/requestFeeder')

router.use(requestFeeder)

router.get('/ping', (req,res) => res.send('pong'))

// signup
router.post('/', user.register)

// get user
router.get('/', user.find)

// update user
router.put('/', user.updateUser)

// email verification
router.get('/verification', user.emailVerification)

// verify user
router.get('/verify', auth.verifyUser)

// authorize user
router.get('/authorize', auth.getToken)

// verify token
router.get('/check', auth.verifyToken)

module.exports = router