const router = require('express').Router()
const user = require('../controllers/userController')

router.get('/ping', (req,res) => res.send('pong'))

// login
router.post('/login', user.login)

// signup
router.post('/', user.create)

// get user
router.get('/', user.find)

// update user
router.put('/', user.update)

module.exports = router