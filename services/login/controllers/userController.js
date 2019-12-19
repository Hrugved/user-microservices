const rp = require('request-promise')
const constants = require('../constants')
const signupService = 'http://localhost:3000'

module.exports = {
    login: async (req,res) => {
        const {email, password} = req.body
        try {
            // check user credentials
            let options = {
                method: 'GET',
                uri: signupService,
                body: {
                    email,
                    password
                },
                json: true
            }
            let response = await rp(options)
            if(!response.status) {
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
            const _permissions = []
            for(let rol in constants.ROLES){
                if(permissions.includes(constants.ROLES[rol])) {
                    _permissions.push(rol)
                }
            }
            res.json({
                role,
                _permissions,
                token: response.token
            })
        } catch(err) {
            res.status(500).send('unable to login')
            console.log('Signup service error', err)
        }
    }
}