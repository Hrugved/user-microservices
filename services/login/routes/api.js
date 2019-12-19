const router = require('express').Router()
const user = require('../controllers/userController')

router.post('/ping', (req,res) => res.send('pong'))

// login
router.post('/', user.login)

module.exports = router