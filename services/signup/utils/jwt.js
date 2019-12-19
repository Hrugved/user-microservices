const jwt = require("jsonwebtoken");
const secret = "thisisasecret";

module.exports.generateToken = (email) => {
    
    return new Promise((resolve,reject) => {
        const payload = { email }
        const options = { expiresIn: "365d" }
        jwt.sign(payload, secret, options, (err,token) => {
            if(err) reject(err)
            resolve(token)
        });
    })
  }
  
module.exports.checkToken = (token) => {
    return new Promise((resolve,reject) => {
        jwt.verify(token, secret, (err,decoded) => {
            if(err) reject(err)
            resolve(decoded)
        })
    })
}