// import { createTransport,sendMail } from "../node_modules/nodemailer";   // does not work
const nodemailer = require("nodemailer");

import HttpException from "../common/httpException";

const sendEmail = (receiver: String, subject: String, text: String) => {
  // need to set the Google account to allow less secure apps to access account
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },

    // secure: false,
    // port: 25,
    // tls: {rejectUnauthorized: false}
  });

  var mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: receiver,
    subject: subject,
    text: text,
  };

  try {
    transporter.sendMail(mailOptions, function (err: unknown, info: unknown) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully send");
      }
    });
  } catch (e) {
    return new HttpException(500, "Cannot send email");
  }
};

const generateForgetPasswordEmail = (token: string) => {
  let link: string = "https://rfriend.herokuapp.com/reset-password/" + token;

  let content: string = "Hi User,\nPlease click the below link to reset password.\n";

  content = content + link;
  content = content + "\nThis link expires in 1 hour.";

  return content;
};


export { sendEmail, generateForgetPasswordEmail };
