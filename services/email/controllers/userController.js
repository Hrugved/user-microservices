const rp = require('request-promise')
const sgMail = require('@sendgrid/mail')

const signupService = 'http://localhost:3000'
const passwordService = 'http://localhost:3003'

module.exports = {
    sendVerificationMail: (req,res) => {
        const {token, email} = req.body
        const msg = {
            to: email,
            from: 'no-reply@crackhire.com',
            subject: 'Verify Your Email',
            html: `Click <a href="${signupService}/verification?token=${token}&email=${email}">here</a> to verify your email `
          };
          sgMail.send(msg);
          res.end()
    }, 

    sendResetPasswordMail: (req,res) => {
        const {token, email} = req.body
        const msg = {
            to: email,
            from: 'no-reply@crackhire.com',
            subject: 'Reset password link',
            html: `Click ${passwordService}/set_password?token=${token}&email=${email} to verify your email `
          };
          sgMail.send(msg);
          res.end() 
    } 
}