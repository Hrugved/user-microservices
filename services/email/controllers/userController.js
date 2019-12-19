const rp = require('request-promise')
const sgMail = require('@sendgrid/mail')

const signupService = 'http://localhost:3000'

module.exports = {
    sendVerificationMail: (req,res) => {
        console.log('hit', req.body)
        const {token, email} = req.body
        const msg = {
            to: email,
            from: 'no-reply@crackhire.com',
            subject: 'Verify Your Email',
            html: `Click <a href="${signupService}/verification?token=${token}&email=${email}">here</a> to verify your email `
          };
          sgMail.send(msg);
    } 
}