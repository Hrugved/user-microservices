const express = require('./node_modules/express')
const sgMail = require('./node_modules/@sendgrid/mail')

const app = express()
app.use(express.json())

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

sendWelcomeEmail = (email,name) => {
    sgMail.send({ 
        to: email,
        from: 'pineappleiitian@gmail.com',
        subject: 'Welcome Email',
        text: `Hi ${name}! Welcome to Crackhire`
    })
}

app.post('/welcome', (req,res,next) => {
    console.log('pinged', req.body)
    sendWelcomeEmail(req.body.email,req.body.name)
    res.end()
})

app.listen(4000, () => console.log('Email service listening on port 4000'))
