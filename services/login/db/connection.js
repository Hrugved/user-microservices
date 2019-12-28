const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require('./config/config.json.js')[env]

const getConnection = (pool,dbName) => {
    return new Promise((resolve,reject) => {
        const connection = new Sequelize(dbName,config.username,config.password, {
            host: config.host,
            dialect: config.dialect,
            pool,
            logging: false
        })
        connection.authenticate()
            .then(() => {
                resolve(connection)
            })
            .catch(err => {
                reject('cannot acquire db: ' + err)
            })
    })
}

const connectionPool = {
    pool : {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}

module.exports = async () => {
    return await getConnection(connectionPool, config.database)
}