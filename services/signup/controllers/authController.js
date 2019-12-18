const jwt = require("jsonwebtoken");
const secret = "thisisasecret";

module.exports = {
  generateToken: (req, res) => {
    const { email } = req.body;
    const payload = {
      email
    };
    const options = {
      expiresIn: "365d"
    };
    const token = jwt.sign(payload, secret, options);
    return res.json({
      token
    });
  },

  verifyToken: (req, res) => {
    const token = req.header["x-access-token"] || req.header["authorization"];
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }
    if (token) {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return res.json({
            message: "Auth token is invalid",
            success: false
          });
        }
        return res.json({
          decoded,
          success: true
        });
      });
    } else {
      return res.json({
        message: "Auth token is not supplied",
        success: false
      });
    }
  }
};
