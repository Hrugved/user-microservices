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

// authorize user
router.get('/authorize', auth.generateToken)

// verify user
router.get('/verify', auth.verifyToken)

module.exports = router