const bcrypt = require('bcryptjs')
const auth = require('../utils/jwt')
const rp = require('request-promise')
const moment = require('moment')

const emailService = 'http://email:3002'

module.exports = {
    register: async(req,res) => { 
        try {
            let email = req.body.email,
            password = req.body.password,
            dateOfBirth = moment(req.body.dateOfBirth, "MM-DD-YY"),
            roles = req.body.roles   
            
            dateOfBirth = moment(dateOfBirth, "MM-DD-YY")
            const existingUser = await req.models.user.findOne({ where: {email}})
            if(existingUser) {
                return res.status(200).json({
                    status : false,
                    message : "User already exists"
                })
            }

            password = await bcrypt.hash(password,8)
            roles = roles.map(role => req.constants.ROLES[role.toUpperCase()])
            await req.models.user.create({
                email,
                password,
                dateOfBirth,
                roles
            })

            sendVerificationMail(email)  
            return res.status(200).json({
                    status : true,
                    message : "User created successfully" 
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
        const {options} = req.body
        try{
            const user = await req.models.user.findOne({where: options})
            // console.log(user)
            if(!user) {
                return res.json({
                    success: false,
                    message: 'no such user exists'
                })
            }
            console.log(user)
            res.json({
                success: true,
                user: {
                    email: user.email
                }
            })
        } catch(err) {
            res.status(500).json({
                success: false,
                message: 'cant find user'
            })
        }
    },

    emailVerification: async (req,res) => {
        const {token, email} = req.query
        try {
            await auth.checkToken(token)
            const user = await req.models.user.findOne({ where: {email}})
            if(!user) {
                throw err
            }
            await user.update({
                emailVerified: true
            })
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

    updateUser: async (req,res) => {
        try {
            const {user,updates} = req.body
            const allowedUpdates = ['emailVerified','password','dateOfBirth','status','roles','lastRole']
            for(let field in updates) {
                if(!allowedUpdates.includes(field)) {
                    delete updates[field]
                }
            }
            if(updates['password']) {
                updates['password'] = await bcrypt.hash(updates['password'],8)
            }

            await req.models.user.update(updates, {where:user}) 
            res.json({success: true})
        }
        catch(err) {
            console.log(err)
            res.status(500).json({success: false})
        }
    } 
}

const sendVerificationMail = async (email) => {
    try {
        // console.log(email)
        const token = await auth.generateToken(email, '10m')
        const options = {
            method: 'POST',
            uri: `${emailService}/verification`,
            body: {
                email,
                token
            },
            json: true
        }
        rp(options) 
    }
    catch(err) {
        console.log(err)
    }
}
