const bcrypt = require('bcrypt')

module.exports = {
    register: async(req,res) => { 
        let email = req.body.email,
        password = req.body.password,
        dateOfBirth = req.body.dateOfBirth,
        roles = req.body.roles   
        
        const existingUser = await this.findUser(email)

        if(existingUser) {
            return res.status(200).json({
                status : false,
                message : "User already exists"
            })
        }

        password = await bcrypt.hashPassword(password,8)
        roles = roles.map(role => req.contants.ROLES[role])
        try{
            const user = await req.models.user.create({
                email,
                password,
                dateOfBirth,
                roles
            })  
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

    verify: async(req,res) => {
        const {email,password} = req.body
        try{
            const user = await this.findUser(email)
            if(user && bcrypt.compare(password,user.password)) {
                res.status(200).json({
                    status: true,
                    user
                })
            }
            return res.status(404).json({
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

    findUser: async (email) => {
        return await req.models.user.findOne({
            where : {
                email
            }
        });
    }
}