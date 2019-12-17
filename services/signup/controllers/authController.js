const jwt = require('jsonwebtoken')
const secret = 'thisisasecret'

module.exports.generateToken(username => {
    const payload = {
        username
    }
    const options = {
        expiresIn: "365d",
    }   
    const token = jwt.sign(payload, secret, options)
})

module.exports.verifyToken((req,res,next) => {
    const token = req.header['x-access-token'] || req.header['authorization']
    if(token.startsWith('Bearer ')){
        token = token.slice(7, token.length)
    }
    if(token) {
        json.verify(token, secret, (err,decoded) => {
            if(err) {
                return res.json({
                    message: 'Auth token is invalid',
                    success: false
                })
            }
            else { 
                req.decoded = decoded
                next()
            }
        })
    } else {
        return res.json({
            message: 'Auth token is not supplied',
            success: false
        })
    }
})