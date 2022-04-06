import nodemailer from "nodemailer";
import HttpException from "../common/httpException";
import jwt from "jsonwebtoken";
import { JWTpayload } from "./authService";

export const sendEmail = (receiver: string, subject: string, text: string) => {
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
    from: {
      name: "rFriend noreply",
      address: process.env.EMAIL_ADDRESS!,
    },
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

export const generateForgetPasswordEmail = (token: string) => {
  let link: string = `${process.env.FRONTEND_BASE_URL}/reset-password/` + token;

  let content: string = "Hi User,\nPlease click the below link to reset password.\n";

  content = content + link;
  content = content + "\nThis link expires in 1 hour.";

  return content;
};


export const sendVerifyEmailEmail = (id: number, name: string, email: string) => {
  const token = jwt.sign(
    { id, email } as JWTpayload,
    process.env.JWT_SECRET_VERIFY_EMAIL!,
    { expiresIn: 36000 } // expires in an hour
  );

  const link = `${process.env.FRONTEND_BASE_URL}/verify/${token}`;
  const subject = "Please confirm your email";
  const content = `
Hi ${name},

Please confirm your email by clicking on the following link

${link}

This link expires in 1 hour.

Best regards,
rFriend Team
  `;

  sendEmail(email, subject, content);
};
