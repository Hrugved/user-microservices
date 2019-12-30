const router = require('express').Router()
const user = require('../controllers/userController')

router.get('/ping', (req,res) => res.send('pong'))

// signup
router.post('/', user.register)

router.post('/verification', user.verifyOtp)

module.exports = router