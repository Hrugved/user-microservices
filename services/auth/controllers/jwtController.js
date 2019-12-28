const auth = require('../utils/jwt')
const bcrypt = require('bcryptjs')

module.exports = {

  // verifyUser: async(req,res) => {
  //   try{
  //       const {email,password} = req.body
  //       const user = await req.models.user.findOne({ where: {email}})
  //       if(user && bcrypt.compare(password,user.password)) {
  //           return res.json({
  //               status: true,
  //               user: {
  //                   emailVerified: user.emailVerified,
  //                   email: user.email,
  //                   role: user.lastRole,
  //                   permissions: user.roles
  //               }
  //           })
  //       }
  //       return res.json({
  //           status: false,
  //           message: "User doesn't exist"
  //       })
  //   } catch(err) {
  //       console.log(err)
  //       return res.status(500).json({
  //           status: false,
  //           message: 'server error'
  //       })
  //   }
  // },

  getToken: async (req, res) => {
    try {
      const { payload, expireIn="365d" } = req.body;
      const token = await auth.generateToken(payload,expireIn)
      return res.json({
        status: true,
        token
      });
    }
    catch(err) {
      console.log(err)
      return res.status(500).json({
        status: false,
        message: 'cannot authorize'
      })
    }
  },

  verifyToken: async (req, res) => {
    const token = req.header["x-access-token"] || req.header["authorization"] || req.query["token"];
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }
    if (token) {
      try {
        const decoded = await auth.checkToken(token)
        return res.json({
          decoded,
          status: true
        });
      }
      catch(err) {
        return res.status(404).json({
          message: "Auth token is invalid",
          status: false
        });
      }

    } else {
      return res.status(404).json({
        message: "Auth token is not supplied",
        status: false
      });
    }
  }
};

