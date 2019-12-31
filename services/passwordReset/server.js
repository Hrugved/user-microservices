const express = require('express')

const app = express()
app.use(express.json())
app.use(express.urlencoded({limit: '50mb', extended: true}))
const PORT = process.env.port || 3002

const router = require('./routes/api')
app.use(router)

require('./db/connection')()
    .then( async(con) => {
        try{
            await con.query(`SET sql_mode = ""`);
            await con.close()
            app.listen(PORT, () => {
                console.log(`service: |PasswordReset| online on port ${PORT}`)
            }) 
        } catch(err) {
            console.log('cannot catch connection' , err)
        }
    })
    .catch(err => {
        console.log('cannot connect to db' , err)
    })