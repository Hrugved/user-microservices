const rp = require('request-promise')

const signupService = 'http://signup:3000'
const emailService = 'http://email:3002'

module.exports = {
  reset: async (req,res) => {
    try {  
      const {email} = req.body 
      // check if user exists
      let options = {
        method: 'GET',
        uri: signupService,
        body: {options: {email}},
        json: true
      }
      let response = await rp(options)
      console.log(response.success)
      if(!response.success) {
        return res.json({
          success: false,
          message: 'no such user exits'
        })
      }
      // delete old token 
      await req.models.resetToken.destroy({
        where: {email}
      })
      // get auth token
      options = {
        method: 'GET',
        uri: `${signupService}/authorize`,
        body: {email, expiresIn: '10m'},
        json: true
      }
      response = await rp(options)
      if(!response.success) {
        throw 'failed to get auth token'
      }
      // save token in db
      const entry = await req.models.resetToken.create({
        token: response.token,
        email
      })
      sendResetPasswordMail(entry.email,entry.token)
      res.json({
        success: true,
        message: 'check email for password reset link'
      })
    } catch(err) {
      console.log(err)
      res.status(500).json({
        success: false,
        message: 'service failed'
      })
    }
  },

  set: async (req,res) => {
    try {
      const {email,token,password} = req.body
      // check if token exists
      let p1 = req.models.resetToken.findOne({
        where: {
          token,
          email
        }
      })
      // check if token is valid
      let options = {
        method: 'GET',
        uri: `${signupService}/check`,
        qs: {token},
        json: true
      }
      let p2 = rp(options)
      let [entry, response] = await Promise.all([p1,p2])
      if(!(entry && response.success)) {
        return res.status(404).json({
          success: false,
          message: 'token is invalid'
        })
      }
      options = {
        method: 'PUT',
        uri: `${signupService}`,
        body: {
          email,
          updates: {password}
        },
        json: true
      }
      response = await rp(options)
      if(!response.success) {
        throw 'signup service failed to update user'
      }
      // delete entry
      await entry.destroy()
      res.json({
        success: true,
        message: 'password is reset successfully'
      })
    } catch(err) {
      console.log(err)
      res.status(500).json({
        success: false
      })
    }
  }
}

const sendResetPasswordMail = (email,token) => {
  try {
      const options = {
          method: 'POST',
          uri: `${emailService}/reset_password`,
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
