const rp = require('request-promise')

module.exports = {
    sendOtp: async (req,res) => {
        try{
            let {phone} = req.body
            let users = await req.models.otp.findOrCreate({
                where: {
                    phone
                }
            })
            let user = users[0]
            // six digit number
            const otp = Math.floor(Math.random() * 900000) + 100000;
            await user.update({ 
                otp, 
                otpCreatedAt: Date.now() 
            })
            await req.client.messages.create({
                body: `Your otp for crackhire account is ${otp}`,
                from: process.env.TWILIO_PHONE,
                to: `+91${phone}`
            })
            res.json({
                status: true,
                message: 'otp sent successfully',
                phone
            })
        } catch(err) {
            console.error(err)
            if(err.status === 400){
                res.status(400).json({
                    status: false,
                    message: 'cannot sent otp, please check if phone-number is valid'
                })
            }
            res.status(500).json({
                status: false,
                message: 'service failure'
            })
        }
    },

    verifyOtp: async (req,res) => {
        try {
            const {phone,otp} = req.body
            const user = await req.models.otp.findOne({
                where: {
                    phone,
                    otp
                }
            })
            if(!user && user.otpCreatedAt - Date.now() >  5*60*100) { //5min
                throw err
            }
            await user.destroy()
            res.json({
                status: true,
                message: 'otp verified successfully'
            })
        } catch(err) {
            console.log(err)
            res.status(400).json({
                status: false,
                message: 'invalid otp'
            })
        } 
    }
}
