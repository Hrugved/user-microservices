const bcrypt = require('bcrypt')

module.exports = {
    register: async(req,res) => { 
        let email = req.body.email,
        password = req.body.password,
        dateOfBirth = req.body.dateOfBirth, // JS default mm-dd-yy
        roles = req.body.roles   

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

    verifyUser: async(req,res) => {
        // console.log('hit', req.body)
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
}

const findUser =  async (user, email) => {
    return await user.findOne({
        where : {
            email
        }
    });
}