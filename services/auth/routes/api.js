const router = require('express').Router()
const jwt = require('../controllers/jwtController')

router.get('/ping', (req,res) => res.send('pong'))

// generates token 
router.get('/authorize', jwt.getToken)

// verify token
router.get('/check', jwt.verifyToken)

module.exports = router