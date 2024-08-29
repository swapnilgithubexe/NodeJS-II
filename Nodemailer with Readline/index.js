// Please don't change the pre-written code
// Import the necessary modules here
import nodemailer from "nodemailer";
import readline from "readline";

const Solution = () => {
    const transporter = nodemailer.createTransport({
        auth: {
            user: "codingninjas2k16@gmail.com",
            pass: "slwvvlczduktvhdj",
        },
        service: "gmail",
    });

    const cninterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    cninterface.question("Enter your email: ", (emailAddress) => {
        const mailOptions = {
            from: "codingninjas2k16@gmail.com",
            to: emailAddress,
            subject: "coding Ninjas",
            text: "The world has enough coders; be a coding ninja!",
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(`Error: ${error}`);
            } else {
                console.log(`Success: Email sent to ${emailAddress}`);
            }
            cninterface.close();
        });
    });
};

export default Solution;
