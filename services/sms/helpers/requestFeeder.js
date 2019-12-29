module.exports = async (req,res,next) => {
    req.db = await require('../db/connection')()
    req.models = {}
    req.models.otp = req.db.import('../db/models/otp')
    req.client = require('twilio')(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN)
    next()   
}