const auth = require('../utils/jwt')

module.exports = {
  getToken: async (req, res) => {
    const { email } = req.body;
    try {
      const token = await auth.generateToken(email)
      return res.json({
        token
      });
    }
    catch(err) {
      console.log(err)
      return res.status(500).json({
        message: 'authentication failed'
      })
    }
  },

  verifyToken: async (req, res) => {
    const token = req.header["x-access-token"] || req.header["authorization"];
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

