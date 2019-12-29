const rp = require('request-promise')

module.exports = {
    sendOtp: async (req,res) => {
        try{
            const {phone} = req.body
            console.log(`+91${phone}`)
            let user = await req.models.otp.findOrCreate({
                phone
            })
            // six digit number
            const otp = Math.floor(Math.random() * 900000) + 100000;
            console.log('otp: ', otp)
            await user.update({ otp, otpCreatedAt: Date.now() })
            await req.client.messages.create({
                body: `Your otp for crackhire account is ${otp}`,
                from: process.env.TWILIO_PHONE,
                to: `+91${phone}`
            })
            res.json({
                status: true,
                message: 'otp sent successfully'
            })
        } catch(err) {
            console.error(err)
            res.status(400).json({
                status: false,
                message: 'cannot sent otp, please check if phone-number is valid'
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
            if(user.otpCreatedAt - Date.now() >  5*60*100) { //5min
                throw err
            }
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
