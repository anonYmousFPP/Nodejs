const express = require("express");
require('dotenv').config();

const app = express();
app.use(express.json());

const sendSMS = async (number) => {
    const client = require('twilio')(process.env.TWILIO_ACCOUNT_ID, process.env.TWILIO_AUTH_TOKEN);
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(otp);
    try{
        const message = await client.messages.create({
            body:
`Your 6-Digit OTP for login verification is: [${otp}]
Please enter this OTP to complete your authentication.
This OTP is valid for 5 minutes.

Best,
Abhay Yadav
[Software Trainee]`,
            from: `+18782099014`,
            to: `+91${number}`
        });
        console.log("Message sent successfully", message);
    }
    catch(err){
        console.log("Error in the code", err);
    }
}

app.post('/sms', async (req, res) => {
    const {number} = req.body;

    try {
        sendSMS(number);
        res.status(200).json({ message: `OTP sent to ${number}` });
    } catch (err) {
        console.error("Twilio error:", err);
        res.status(500).json({ error: "Failed to send SMS", details: err.message });
    }
})

app.listen(3000);