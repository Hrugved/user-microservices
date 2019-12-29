const rp = require('request-promise')
const bcrypt = require('bcryptjs')
const rp = require('request-promise')
const moment = require('moment')

module.exports = {
    login: async (req,res) => {
        const {email, password} = req.body
        try {
            // check user credentials
            let options = {
                method: 'GET',
                uri: `${signupService}/verify`,
                body: {
                    email,
                    password
                },
                json: true
            }
            let response = await rp(options)
            if(!(response.status && response.user.emailVerified)) {
                return res.json(response)
            }
            // get auth token
            let {permissions, role} = response.user 
            console.log(role)
            options = {
                method: 'GET',
                uri: `${signupService}/authorize`,
                body: {
                    email
                },
                json: true
            }
            response = await rp(options)
            res.json({
                role,
                permissions,
                token: response.token
            })
        } catch(err) {
            res.status(500).send('unable to login')
            console.log('Signup service error', err)
        }
    },

    // DONE
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
            // console.log(user)
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
