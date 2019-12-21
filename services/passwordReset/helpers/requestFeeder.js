const connection = require('../db/connection')

module.exports = async (req,res,next) => {
    try {
        req.db = await connection()
        req.models = {}
        req.models.resetToken = req.db.import('../db/models/resettoken')
        next()
    } catch(err) {
        console.error(err)
    }
}