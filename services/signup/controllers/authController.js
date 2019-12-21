const auth = require('../utils/jwt')

module.exports = {

  verifyUser: async(req,res) => {
    try{
        const {email,password} = req.body
        const user = await req.models.user.findOne({ where: {email}})
        if(user && bcrypt.compare(password,user.password)) {
            return res.json({
                success: true,
                user: {
                    emailVerified: user.emailVerified,
                    email: user.email,
                    role: user.lastRole,
                    permissions: user.roles
                }
            })
        }
        return res.json({
            success: false,
            message: "User doesn't exist"
        })
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: 'server error'
        })
    }
  },

  getToken: async (req, res) => {
    try {
      const { email, expireIn="365d" } = req.body;
      const token = await auth.generateToken(email,expireIn)
      return res.json({
        success: true,
        token
      });
    }
    catch(err) {
      console.log(err)
      return res.status(500).json({
        success: false,
        message: 'authentication failed'
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
          success: true
        });
      }
      catch(err) {
        return res.json({
          message: "Auth token is invalid",
          success: false
        });
      }

    } else {
      return res.json({
        message: "Auth token is not supplied",
        success: false
      });
    }
  }
};

