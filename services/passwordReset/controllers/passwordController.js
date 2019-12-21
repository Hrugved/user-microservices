const rp = require('request-promise')

const signupService = 'http://localhost:3000'
const emailService = 'http://localhost:3002'

module.exports = {
  reset: async (req,res) => {
    try {  
      const {email} = req.body 
      // check if user exists
      let options = {
        method: 'GET',
        uri: signupService,
        body: {email},
        json: true
      }
      let response = await rp(options)
      if(!response.success) {
        return res.json({
          success: false,
          message: 'no such user exits'
        })
      }
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
      let entry = req.models.resetToken.findOne({
        token,
        email
      })
      // check if token is valid
      let options = {
        method: 'GET',
        uri: `${signupService}/check`,
        qs: {token},
        json: true
      }
      let response = rp(options)
      [entry, response] = await Promise.all(entry,response)
      if(!(entry && response.success)) {
        return res.status(404).json({
          success: false,
          message: 'token is invalid'
        })
      }
      options = {
        method: 'UPDATE',
        uri: `${signupService}`,
        body: {
          email,
          options: {password}
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
