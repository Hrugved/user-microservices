const router = require('express').Router()
const password = require('../controllers/passwordController')
const requestFeeder = require('../helpers/requestFeeder')

router.use(requestFeeder)

router.get('/ping', (req,res) => res.send('pong'))

router.post('/reset_password', password.reset)

router.post('/set_password', password.set)

module.exports = router