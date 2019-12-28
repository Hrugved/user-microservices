const jwt = require("jsonwebtoken");
const secret = "thisisasecret";

module.exports.generateToken = (payload, expiresIn = "365d") => {
    
    return new Promise((resolve,reject) => {
        const options = { expiresIn }
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