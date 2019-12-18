const connection = require('../db/connection')
const constants = require('../constants')

module.exports = async (req,res,next) => {
    try {
        req.db = await connection()
        req.models = {}
        req.models.user = req.db.import('../db/models/user')
        req.constants = constants
        next()
    } catch(err) {
        console.error(err)
    }
}