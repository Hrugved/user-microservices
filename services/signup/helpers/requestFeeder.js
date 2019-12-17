const connection = require('../db/connection')
const constants = require('../constants')
const User = require('../db/models/user')

module.exports = async (req,res,next) => {
    try {
        req.db = await connection()
        req.models.user = req.db.import(User)
        req.constants = constants
        next()
    } catch(err) {
        console.error(err)
    }
}