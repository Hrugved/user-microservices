const router = require('express').Router()
const auth = require('../controllers/jwtController')

router.get('/ping', (req,res) => res.send('pong'))

// // verify user
// router.get('/verify', auth.verifyUser)

// generates token 
router.get('/authorize', jwt.getToken)

// verify token
router.get('/check', jwt.verifyToken)

module.exports = router