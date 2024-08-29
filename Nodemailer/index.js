// Please don't change the pre-written code
// Import the necessary modules here
import nodemailer from 'nodemailer';
// import readline from 'readline';


const Solution = () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "codingninjas2k16@gmail.com",
      pass: "slwvvlczduktvhdj",
    },
    tls: {
      rejectUnauthorized: false,
    }
  })
  const mailOptions = {
    from: "codingninjas2k16@gmail.com",
    to: "swapnildutta2002@gmail.com",
    subject: "Coding Ninjas",
    text: "The world has enough coders; be a coding ninja!",
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(`Error sending the message, ${error}`)
    } else {
      console.log("Email sent")
    }
  })

};

export default Solution;
