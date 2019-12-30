const express = require('express')

const app = express()
app.use(express.json())
app.use(express.urlencoded({limit: '50mb', extended: true}))
const PORT = process.env.port || 3003

const router = require('./routes/api')
app.use(router)

app.listen(PORT, () => {
    console.log(`service: |auth| online on port ${PORT}`)
})
 