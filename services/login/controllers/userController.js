const rp = require('request-promise')
const bcrypt = require('bcryptjs')
const constants = require('../constants')

module.exports = {

    // login options: 
    //    - email/phone + password/otp
    login: async (req,res) => {
        try {
            let {email=null,phone=null,password=null} = req.body
            if(!(email || phone)) {
                throw new Error('email or phone required')
            }
            if(email) {
                const user = req.models.user.findOne({
                    email
                })
            } else {
                const user = req.models.user.findOne({
                    phone   
                })
            }
            if(!user) {
                throw new Error('invalid user credentials')
            }
            if(user.status === constants.STATUS.PENDING_ACTIVATION) {
                throw new Error('Account registration is incomplete. Complete your phone verification.')
            }
            if(user.status === constants.STATUS.BLOCKED) {
                throw new Error('Account is blocked.')
            }
            if(password) {
                // login with password  
                // TODO hande if password invalid
                await bcrypt.compare(password,user.password)
                const response = await getAuthTokenHandler(user)
                return res.send({
                    status: true,
                    token
                }) 
            } else {
                // login with otp
                await sendOtpHandler(phone)
                return res.json({
                    status: true,
                    message: 'Check phone for otp',
                    phone
                })
            }

        } catch(err) {
            console.log(err)
            // TODO check handling of code Error 
            if(err.name == 'Error') {
                return res.status(404).json({
                    status: false,
                    message: err.message
                })
            }
        }
    },

    loginByOtp: async(req,res) => {
        try {
            const {phone,otp} = req.body
            let response = await verifyOtpHandler(phone,otp)
            response = await getAuthTokenHandler(user)
            return res.json({
                status: true,
                token
            }) 
        } catch(err) {
            if(err.statusCode === 400) {
                return res.status(400).json({
                    status: false,
                    message: 'invalid otp'
                })
            }
            res.status.json({
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
            const existingUser = await req.models.user.findOne({ where: {phone}})
            if(existingUser) {
                return res.status(404).json({
                    status : false,
                    message : "User already exists"
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
            res.json({status: true, users: users.length})
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
