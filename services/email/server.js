const express = require('express')
require('dotenv').config({path: __dirname + '/config/dev.env'})
require('@sendgrid/mail').setApiKey(process.env.SENDGRID_API_KEY)

const app = express()
app.use(express.json())
app.use(express.urlencoded({limit: '50mb', extended: true}))
const PORT = process.env.port || 3004

const router = require('./routes/api')
app.use(router)

app.listen(PORT, () => {
    console.log(`service: |Email| online on port ${PORT}`)
}) 