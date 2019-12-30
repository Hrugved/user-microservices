const rp = require('request-promise')
const services = require('../services')
const constants = require('../constants')

module.exports = {
    register: async(req,res) => { 
        try {
            let {
                name,
                email,
                password,
                phone
            } = req.body; 
            const response = await createUserHandler({
                name,
                email,
                password,
                phone
            });
            // console.log(response)

            // sendOtpHandler(phone)
            sendVerificationMailHandler(email)

            return res.status(200).json({
                    status : true,
                    message : "Check phone for otp" 
            })
        }

        catch(err) {
            if(err.statusCode === 404) {
                return res.status(404).json({
                    status: false,
                    message: 'User is already registered'
                })
            }
            console.log(err)
            return res.status(500).json({
                status : false,
                message : "Cannot create user"
            })
        }
    },

    verifyOtp: async(req,res) => {
        try {
            const {phone,otp} = req.body
            await verifyOtpHandler(phone,otp)
            await updateUserStatusHandler(phone)
            res.json({
                status: true,
                message: 'Otp verified. User registered successfully'
            })
        } catch(err) {
            if(err.statusCode === '400') {
                return res.json(404).json({
                    status: false,
                    message: 'invalid otp'
                })
            }
            console.log(err)
            return res.status(500).json({
                status: false,
                message: 'service error'
            })
        }
    }
}

// helpers

const sendVerificationMailHandler = async (email) => {
    try {
        console.log('signup func')
        const options = {
            method: 'GET',
            uri: `${services.email}/send_verification`,
            body: {
                email
            },
            json: true
        }
        rp(options) 
    }
    catch(err) {
        console.log(err)
    }
}

const sendOtpHandler = async(phone) => {
    const options = {
        method: 'GET',
        uri: `${services.sms}/send_otp`,
        body: {
            phone
        },
        json: true
    }
    return rp(options)
}

const verifyOtpHandler = async(phone,otp) => {
    const options = {
        method: 'GET',
        uri: `${services.sms}/verify_otp`,
        body: {
            phone,
            otp
        },
        json: true
    }
    return rp(options)
}

const createUserHandler = async(user) => {
    const options = {
        method: 'POST',
        uri: services.login,
        body: {
            ...user
        },
        json: true
    }
    return rp(options)
}

const updateUserStatusHandler = async(phone) => {
    const options = {
        method: 'PUT',
        uri: services.login,
        body: {
            user: {
                phone
            }, updates: {
                status: constants.STATUS.ACTIVE 
            }
        },
        json: true
    }
    return rp(options)
}
