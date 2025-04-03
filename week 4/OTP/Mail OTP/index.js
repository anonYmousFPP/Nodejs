const nodemailer = require("nodemailer");
const express = require("express");

const app = express();
app.use(express.json());
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  }
});

const sendEmail = async (name, email) => {

  const mailOptions = {
    from: "abhay14122001@gmail.com",
    to: `${email}`,
    subject: "Test Email is test email from Nodemailer",
    html: `<h3>Subject: Welcome to the Email Notification System</h3>

            Hi ${name},

            Welcome to our Notification System!

            This is a test email to verify that your Nodemailer setup is working correctly.
            Please find the attached **Holiday Calendar** for reference.

            Best Regards,
            [Abhay Yadav]
          `,
    attachments: [{
      filename: "Holiday calendar 2025.pdf",
      path: "./Holiday\ calendar\ 2025.pdf"
    }]
  };

  try{
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.messageId);
  }
  catch(err){
    console.log("Error sending email: ", err);
  }
}

app.post('/email', (req, res) => {
  const {name, email} = req.body;
  console.log(`Name is ${name} email is ${email}`);

  if(!name || !email){
    res.send({message: `Invalid Credentials ${err}`}).status(400);
  }

  try{
    sendEmail(name, email);
    res.send({message: `Email is send to user ${name} with email ${email}`}).status(200);
  }
  catch(err){
    res.send({message: `Error is found ${err}`}).status(400);
  }
})


app.listen(3000);