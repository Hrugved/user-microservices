const bcrypt = require('bcrypt')
const auth = require('../utils/jwt')
const rp = require('request-promise')
const moment = require('moment')

const emailService = 'http://localhost:3002'

module.exports = {
    register: async(req,res) => { 
        let email = req.body.email,
        password = req.body.password,
        dateOfBirth = moment(req.body.dateOfBirth, "MM-DD-YY"),
        roles = req.body.roles   
        
        dateOfBirth = moment(dateOfBirth, "MM-DD-YY")
        const existingUser = await findUser(req.models.user,email)
        if(existingUser) {
            return res.status(200).json({
                status : false,
                message : "User already exists"
            })
        }
        
        password = await bcrypt.hash(password,8)
        roles = roles.map(role => req.constants.ROLES[role.toUpperCase()])
        try{
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
                message : "Cannot create users"
            })
        }
    },

    verifyUser: async(req,res) => {
        const {email,password} = req.body
        try{
            const user = await findUser(req.models.user,email)
            if(user && bcrypt.compare(password,user.password)) {
                return res.json({
                    status: true,
                    user: {
                        email: user.email,
                        role: user.lastRole,
                        permissions: user.roles
                    }
                })
            }
            return res.json({
                status: false,
                message: "User doesn't exist"
            })
        } catch(err) {
            console.log(err)
            return res.status(500).json({
                status: false,
                message: 'server error'
            })
        }
    },

    emailVerification: async (req,res) => {
        console.log('hit', req.query)
        const {token, email} = req.query
        try {
            await auth.checkToken(token)
            const user = await findUser(req.models.user,email)
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
            res.status(404).send({
                status: false,
                message: 'Email verification failed'
            })
        } 
    }
}

const findUser =  async (user, email) => {
    return await user.findOne({
        where : {
            email
        }
    });
}

const sendVerificationMail = async (email) => {
    try {
        const token = await auth.generateToken(email)
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