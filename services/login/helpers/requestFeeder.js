const connection = require('../db/connection')

module.exports = async (req,res,next) => {
    try {
        req.db = await connection()
        req.models = {}
        req.models.user = req.db.import('../db/models/user') 
        next()
    } catch(err) {
        console.error(err)
    }
}