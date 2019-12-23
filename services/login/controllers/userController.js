const rp = require('request-promise')

const signupService = 'http://signup:3000'

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
    }
}