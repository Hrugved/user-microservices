const rp = require('request-promise')
const sgMail = require('@sendgrid/mail')
const services = require('../services')

const emailUrl = 'localhost:3004/check_verification'

module.exports = {
    sendVerificationEmail: async (req,res) => {
        try{
            const {email} = req.body
            const repsonse = await getToken(email)
            const msg = {
                to: email,
                from: 'no-reply@crackhire.com',
                subject: 'Verify Your Email',
                html: `Click <a href="${eamilUrl}/verification?token=${response.token}&email=${email}">here</a> to verify your email.`
            };
            sgMail.send(msg);
            res.end()
        } catch(err) {
            console.log(err)
        }
    }, 

    verifyEmail: async (req,res) => {
        const {token, email} = req.query
        try {
            const response = await checkToken(token)
            await emailVerifiedHandler(email)
            res.json({
                status: true,
                message: 'Email verified successfully'
            })
        }
        catch(err) {
            console.log(err)
            res.status(404).json({
                status: false,
                message: 'Email verification failed'
            })
        } 
    },

    sendResetPasswordEmail: (req,res) => {
        const {token, email} = req.body
        const msg = {
            to: email,
            from: 'no-reply@crackhire.com',
            subject: 'Reset password link',
            html: `Click ${passwordResetService}/set_password?token=${token}&email=${email} to reset your password `
          };
          sgMail.send(msg);
          res.end() 
    } 
}

const getUser = async (email) => {
    let options = {
        method: 'GET',
        uri: services.login,
        body: {
            options: {
                email
            }
        },
        json: true
    }
    return await rp(options)
}

const getToken = async (email) => {
    options = {
        method: 'GET',
        uri: `${services.auth}/authorize`,
        body: {
            email,
            expiresin: '10min'
        },
        json: true
    }
    return await rp(options)
}

const checkToken = async (email) => {
    options = {
        method: 'GET',
        uri: `${services.auth}/check`,
        json: true
    }
    return await rp(options)
}

const emailVerifiedHandler = async (email) => {
    options = {
        method: 'PUT',
        uri: services.login,
        body: {
            user: {
                email
            },
            updates: {
                emailVerified: true
            }
        },
        json: true
    }
    return await rp(options)
}