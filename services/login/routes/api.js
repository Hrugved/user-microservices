const router = require('express').Router()
const user = require('../controllers/userController')

router.get('/ping', (req,res) => res.send('pong'))

// login
router.post('/', user.login)

// signup
router.post('/', user.create)

// get user
router.get('/', user.find)

// update user
router.put('/', user.update)

// email verification
router.get('/verification', user.emailVerification)

module.exports = router