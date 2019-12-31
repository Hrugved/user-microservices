const rp = require('request-promise')
const bcrypt = require('bcryptjs')
const constants = require('../constants')
const services = require('../services')

module.exports = {

    // login options: 
    //    - email/phone + password/otp
    //    - if password is not provided => login by OTP
    login: async (req,res) => {
        try {
            let {email=null,phone=null,password=null} = req.body
            if(!(email || phone)) {
                throw new clientError('email or phone required')
            }
            let user
            if(email) {
                user = await req.models.user.findOne({
                    where: { email }
                })
            } else {
                user = await req.models.user.findOne({
                    where: { phone }   
                })
            }
            if(!user) {
                throw new clientError('invalid user credentials')
            }
            // console.log(user)
            if(user.status === constants.STATUS.PENDING_ACTIVATION) {
                throw new clientError('Account registration is incomplete. Complete your phone verification.')
            }
            if(user.status === constants.STATUS.BLOCKED) {
                throw new clientError('Account is blocked.')
            }
            if(password) {
                // login with password  
                if(!(await bcrypt.compare(password,user.password))) {
                    throw new clientError('invalid user credentials')
                }
                const response = await getAuthTokenHandler(user)
                return res.send({
                    status: true,
                    token: response.token
                }) 
            } else {
                // login with otp
                await sendOtpHandler(user.phone)

                return res.json({
                    status: true,
                    message: 'Check phone for otp',
                    phone: user.phone
                })
            }

        } catch(err) {
            console.log(err)
            if(err.name == 'clientError') {
                return res.status(400).json({
                    status: false,
                    message: err.message
                })
            }
            res.status(500).json({
                status: false,
                message: 'service failure'
            })
        }
    },

    loginByOtp: async(req,res) => {
        console.log('login_otp hit')
        try {
            const {phone,otp} = req.body
            const user = await req.models.user.findOne({ where: {phone}})
            let response = await verifyOtpHandler(phone,otp)
            response = await getAuthTokenHandler(user)
            return res.json({
                status: true,
                token: response.token
            }) 
        } catch(err) {
            console.log(err)
            if(err.statusCode === 400) {
                return res.status(400).json({
                    status: false,
                    message: 'invalid otp'
                })
            }
            res.status(500).json({
                status: false,
                message: 'login failed'
            })
        }
    },

    create: async(req,res) => { 
        try {
            let {
                name,
                email,
                password,
                phone
            } = req.body; 
            let existingUser = await req.models.user.findOne({ where: {phone}})
            if(existingUser) {
                return res.status(404).json({
                    status : false,
                    message : "User with this phone is already registered"
                })
            }
            existingUser = await req.models.user.findOne({ where: {email}})
            if(existingUser) {
                return res.status(404).json({
                    status : false,
                    message : "User with this email is already registered"
                })
            }
            password = await bcrypt.hash(password,8)
            const user = await req.models.user.create({
                name,
                email,
                password,
                phone
            })
            return res.status(200).json({
                    status : true,
                    message : "User created successfully" ,
                    user: {
                        name: user.name,
                        email: user.email,
                        phone: user.phone
                    }
                })
            }
            catch(err) {
                console.log(err)
                return res.status(500).json({
                    status : false,
                    message : "Cannot create user"
                })
            }
        },

    find: async (req,res) => {
        const options = {...req.body}
        try{
            const user = await req.models.user.findOne({where: options})
            if(!user) {
                return res.json({
                    status: false,
                    message: 'no such user exists'
                })
            }
            res.json({
                status: true,
                user: {
                    email: user.email,
                    phone: user.phone,
                    name: user.name
                }
            })
        } catch(err) {
            console.log(err)
            res.status(500).json({
                status: false,
                message: 'service failure'
            })
        }
    },

    update: async (req,res) => {
        try {
            const {user,updates} = req.body
            const allowedUpdates = ['emailVerified','password','status']
            for(let field in updates) {
                if(!allowedUpdates.includes(field)) {
                    delete updates[field]
                }
            }
            if(updates['password']) {
                updates['password'] = await bcrypt.hash(updates['password'],8)
            }

            const users = await req.models.user.update(updates, {where:user}) 
            res.json({status: true, users: users.length, updated: Object.keys(updates)})
        }
        catch(err) {
            console.log(err)
            res.status(500).json({status: false})
        }
    } 
}


// helpers
getAuthTokenHandler = async (user) => {
    options = {
        method: 'GET',
        uri: `${services.auth}/authorize`,
        body: {
            payload:{
                userId: user.id,
                email: user.email,
                phone: user.phone
            }
        },
        json: true
    }
    return await rp(options)
}

const sendOtpHandler = async(phone) => {
    console.log(services.sms)
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

class clientError extends Error {
    constructor(message = 'client side error') {
        super(message)
        this.name = 'clientError'
    }
    throw() {
        throw this
    }
}