const rp = require('request-promise')
const constants = require('../constants')

module.exports = {
  reset: async (req,res) => {
    try {  
      const {email} = req.body 
      // check if user exists
      let response = await getUserHandler(email)
      if(!response.status) {
        return res.json({
          status: false,
          message: 'invalid use credentials'
        })
      }
      response = await getAuthTokenHandler(email)
      const entry = await req.models.resetToken.findOrCreate({
        email
      })
      await entry.update({token: response.token})
      sendResetPasswordMailHandler(entry.email,entry.token)
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
      let p2 = checkAuthTokenHandler(token)
      let [entry, response] = await Promise.all([p1,p2])
      if(!(entry)) {
        return res.status(404).json({
          success: false,
          message: 'token is invalid'
        })
      }
      await updatePasswordHandler(email,password)
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

const sendResetPasswordMailHandler = (email,token) => {
    const options = {
        method: 'POST',
        uri: `${services.email}/reset_password`,
        body: {
            email,
            token
        },
        json: true
    }
    rp(options) 
}

const getUserHandler = async (email) => {
  const options = {
    method: 'GET',
    uri: services.login,
    body: {
        email
    },
    json: true
  }
  return rp(options)
}

const updatePasswordHandler = async(email,password) => {
  const options = {
      method: 'PUT',
      uri: services.login,
      body: {
          user: {
              email
          }, updates: {
              password
          }
      },
      json: true
  }
  return rp(options)
}

const getAuthTokenHandler = (email) => {
  options = {
      method: 'GET',
      uri: `${services.auth}/authorize`,
      body: {
          payload:{
              email
          },
          expiresIn: '10m'
      },
      json: true
  }
  //TODO check if await should be written 
  return rp(options)
}

const checkAuthTokenHandler = () => {
  const options = {
    method: 'GET',
    uri: `${services.auth}/check`,
    body: {
      token
    },
    json: true
  }
  return rp(options)
}

