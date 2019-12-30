const rp = require('request-promise')
const sgMail = require('@sendgrid/mail')
const services = require('../services')

const emailUrl = 'localhost:3004/check_verification'

module.exports = {
    sendVerificationEmail: async (req,res) => {
        console.log('hit')
        try{
            const {email} = req.body
            const response = await getTokenHandler(email)
            console.log(response.token)
            const msg = {
                to: email,
                from: 'no-reply@crackhire.com',
                subject: 'Verify Your Email',
                html: `<p>Visit below link to to verify your email</p><p>${emailUrl}?token=${response.token}&email=${email}</p> `
            };
            sgMail.send(msg);
            res.end()
        } catch(err) {
            console.log(err)
        }
    }, 

    verifyEmail: async (req,res) => {
        try {
            const {email, token} = req.query
            const response = await checkTokenHandler(token)
            if(response.decoded.email !== email) {
                throw new Error()
            }
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

const getTokenHandler = async (email) => {
    options = {
        method: 'GET',
        uri: `${services.auth}/authorize`,
        body: {
            payload:{
                email
            },
            expiresin: '10min'
        },
        json: true
    }
    return await rp(options)
}

const checkTokenHandler = async (token) => {
    options = {
        method: 'GET',
        uri: `${services.auth}/check`,
        body: {
            token
        },
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