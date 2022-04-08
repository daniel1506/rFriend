import request from "supertest";
import app from "../../index";
import HttpException from "../../common/httpException";

import { forgetPassword, resetPassword } from "../../controllers/userController";
import { sendVerifyEmailEmail } from "../../services/emailService";
// import { authMiddleware } from "../../middleware/authMiddleware";
import prisma from "../../jest.setup";
import jwt from "jsonwebtoken";

// -----------------------------------------------------------------------------

const userArray = [
  {
    id: 1,
    email: "a@a.com",
    name: "user1",
    password: "passworda",
    profile_url: "https://csci3100project.s3.ap-southeast-1.amazonaws.com/img1",
  },
  {
    id: 2,
    email: "b@a.com",
    name: "user2",
    password: "passwordb",
    profile_url: "https://csci3100project.s3.ap-southeast-1.amazonaws.com/img2",
  },
  { id: 3, email: "c@a.com", name: "user3", password: "passwordc", profile_url: null },
];

const registerUrl = "/api/user/register";
const loginUrl = "/api/user/login";
// const forgetPasswordUrl = "/api/user/forget_pw";
// const resetPasswordUrl = "/api/user/pw_reset";

// -----------------------------------------------------------------------------

describe("Forget and Reset Password", () => {
  jest.mock("../../controllers/userController");
  sendVerifyEmailEmail = jest.fn(); // ignore sending verify email

  // register all the users first
  beforeAll(async () => {
    // register all users first
    for (let i of userArray) {
      // console.log(i); //  delete
      let res = await request(app).post(registerUrl).send(i);
      // console.log(res.body);   // delete
    }
  });

  // a function that gives a mock function, which generates and stores a reset pw token with a specified expire time
  const forgetPassword_mock = (expireTime) => {
    return jest.fn(async () => {
      const token = jwt.sign(
        {
          id: userArray[0].id,
          email: userArray[0].email,
        },
        process.env.JWT_SECRET_FORGET_PW,
        { expiresIn: expireTime }
      );

      // store/update the token into the DB
      try {
        let user = await prisma.user.update({
          where: { email: userArray[0].email },
          data: { resetPasswordToken: token },
        });

        //   if (!user) {
        //     return next(new HttpException(400, "Cannot update token for forget password."));
        //   }
        return token;
      } catch (e) {
        // return next(prismaErrorHandler(e));
      }
    });
  };

  // wait some time (used in the second test and the third test)
  function wait(time) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        console.log("wait some time");
        res();
      }, time);
    });
  }

  it("Should be able to login with the new password if the token is valid", async () => {
    let id = userArray[0].id;
    let name = userArray[0].name;
    let email = userArray[0].email;
    let profile_url = userArray[0].profile_url;
    let new_pw = "newpassword0";

    let req = { body: { email: email } };
    let res = { send: jest.fn() };
    let next = jest.fn();

    forgetPassword = forgetPassword_mock(36000);
    let token = await forgetPassword(req, res, next); // get a token for resetting pw first

    req = { body: { password: new_pw, token: token } };
    res = { send: jest.fn() };
    next = jest.fn();

    await resetPassword(req, res, next);
    expect(res.send).toHaveBeenCalled();

    // login with new password
    const login = await request(app).post(loginUrl).send({
      name: name,
      email: email,
      password: new_pw,
    });
    console.log(login.body); // delete
    expect(login.status).toBe(200);
  });

  it("Should not be able to change the password if the token does not match with the one in the DB", async () => {
    let id = userArray[1].id;
    let name = userArray[1].name;
    let email = userArray[1].email;
    let profile_url = userArray[1].profile_url;
    let new_pw = "newpassword1";
    // use another user to test to avoid the effect of the previous test on the DB
    let req = { body: { email: email } };
    let res = { send: jest.fn() };
    let next = jest.fn();

    forgetPassword = forgetPassword_mock(36000);
    //  console.log(forgetPassword(req, res, next)); //delete
    let token = await forgetPassword(req, res, next); // get a token for resetting pw first
    console.log("first token is"); // delete
    console.log(token); // delete

    await wait(1000); // wait for a second to ensure that the next token generated is different

    let token_new = await forgetPassword(req, res, next); // renew the token
    console.log("new token is"); // delete
    console.log(token_new); // delete

    req = { body: { password: new_pw, token: token } }; // try to reset password using the old token
    res = { send: jest.fn() };
    next = jest.fn();

    await resetPassword(req, res, next);
    expect(next).toBeCalledWith(new HttpException(401, "Invalid forget password token"));

    // login with new password
    const login = await request(app).post(loginUrl).send({
      name: name,
      email: email,
      password: new_pw,
    });
    console.log(login.body); // delete

    expect(login.status).toBe(401);
  });

  it("Should not be able to change the password if the token expires", async () => {
    let id = userArray[2].id;
    let name = userArray[2].name;
    let email = userArray[2].email;
    let profile_url = userArray[2].profile_url;
    let new_pw = "newpassword2";

    // use another user to test to avoid the effect of the previous test on the DB
    let req = { body: { email: email } };
    let res = { send: jest.fn() };
    let next = jest.fn();

    forgetPassword = forgetPassword_mock(500); // make the expire time short enough to ensure that it expires immediately after its creation
    // console.log("token from last test is "); // delete
    // console.log(token); // delete

    let token = await forgetPassword(req, res, next); // get a token for resetting pw first
    await wait(1000); // wait some time to make the token expire
    console.log("token is"); // delete
    console.log(token); // delete

    req = { body: { password: new_pw, token: token } };
    res = { send: jest.fn() };
    next = jest.fn();

    await resetPassword(req, res, next);
    expect(next).toBeCalledWith(new HttpException(401, "Forget password token expired"));

    // login with new password
    const login = await request(app).post(loginUrl).send({
      name: name,
      email: email,
      password: new_pw,
    });
    console.log(login.body); // delete

    expect(login.status).toBe(401);
  });
});

// describe("database testing(delete)", () =>{
//     it("extra test 1", async () =>{
//        //  prisma.user.create = jest.spyon();
//         let user = await prisma.user.create({
//             data:{

//             name: "New user",
//             email: "new@gmail.com",
//             password: "hash",
//             }

//     }
//     );
//     console.log(user);
//     // expect(prisma.user.create).toHaveBeenCalled();
// });

//     it("extra test 2", async () =>{
//         let user = await prisma.user.findUnique({
//             where:{

//                 email: "new@gmail.com",
//                 // password: "hash",
//             }

//       });
//       console.log(user);
//   });

// });
