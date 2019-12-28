const rp = require('request-promise')
const services = require('../services')

module.exports = {
    register: async(req,res) => { 
        try {
            const response = await createUser({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                phone: req.body.phone 
            });
            
            // TODO create sendOtp func
            sendOtp(phone)
            sendVerificationMail(email)

            return res.status(200).json({
                    status : true,
                    message : "Check phone for otp" 
            })
        }

        catch(err) {
            if(err.statusCode == 404) {
                return res.status(404).send({
                    status: false,
                    message: 'User is already regitered'
                })
            }
            return res.status(500).json({
                status : false,
                message : "Cannot create user"
            })
        }
    },
}


// helpers

const sendVerificationMail = async (email) => {
    try {
        // TODO create generateToken
        const token = await auth.generateToken(email, '10m')
        const options = {
            method: 'POST',
            uri: `${services.email}/verification`,
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
