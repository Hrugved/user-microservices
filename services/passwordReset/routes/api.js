const router = require('express').Router()
const user = require('../controllers/passwordController')

router.post('/ping', (req,res) => res.send('pong'))

router.post('/reset_password', password.reset)

router.post('/set_password', password.set)

module.exports = router