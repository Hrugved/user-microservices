const router = require('express').Router()
const password = require('../controllers/passwordController')
const requestFeeder = require('../helpers/requestFeeder')

router.use(requestFeeder)

router.get('/ping', (req,res) => res.send('pong'))

router.get('/reset_password', password.reset)

router.post('/reset_password', password.set)

module.exports = router