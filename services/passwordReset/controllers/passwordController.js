const rp = require('request-promise')
const constants = require('../constants')
const services = require('../services')

module.exports = {
  reset: async (req,res) => {
    try {  
      const {email} = req.body 
      let response = await getUserHandler(email)
      const otp = Math.floor(Math.random() * 900000) + 100000;
      response = await getAuthTokenHandler(email, otp)
      let entry = await req.models.resetToken.findOrCreate({
        where: {email}
      })
      entry = entry[0]
      await entry.update({otp})
      sendResetPasswordMailHandler(entry.email,response.token)
      res.json({
        status: true,
        message: 'check email for password reset link'
      })
    } catch(err) {
      if(err.statusCode === 404) {
        return res.json({
          status: false,
          message: 'invalid user credentials'
        }) 
      }
      console.log(err)
      res.status(500).json({
        status: false,
        message: 'service failed'
      })
    }
  },

  set: async (req,res) => {
    try {
      const {email,token,password} = req.body
      let p1 = req.models.resetToken.findOne({
        where: {
          email
        }
      })
      let p2 = checkAuthTokenHandler(token)
      let [entry, response] = await Promise.all([p1,p2])
      if(!(entry) || (response.decoded.email !== entry.email || response.decoded.otp !== entry.otp)) {
        return res.status(404).json({
          status: false,
          message: 'token is invalid'
        })
      }
      await updatePasswordHandler(email,password)
      await entry.destroy()
      res.json({
        status: true,
        message: 'password reset successfully'
      })
    } catch(err) {
      console.log(err)
      res.status(500).json({
        status: false
      })
    }
  }
}

const sendResetPasswordMailHandler = (email,token) => {
    const options = {
        method: 'POST',
        uri: `${services.email}/send_reset_password`,
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

const getAuthTokenHandler = (email,otp) => {
  options = {
      method: 'GET',
      uri: `${services.auth}/authorize`,
      body: {
          payload:{
              email,
              otp
          },
          expiresIn: '10m'
      },
      json: true
  }
  //TODO check if await should be written 
  return rp(options)
}

const checkAuthTokenHandler = (token) => {
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

