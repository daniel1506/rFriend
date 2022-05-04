import request from "supertest";
import app from "../../index";

import prisma from "../../jest.setup";

import { getProfile } from "../../controllers/userController";

import { s3Client as s3Client_mock } from "../../AWS/s3Cient";
import { NextFunction, Request, Response } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";

import jestConfig from "../../jest.config";
import HttpException from "../../common/httpException";
// -----------------------------------------------------------------------------

const userArray = [
  {
    id: 1,
    email: "a@a.com",
    name: "user1",
    password: "passworda",
    profile_url: null,
  },
  {
    id: 2,
    email: "b@a.com",
    name: "user2",
    password: "passwordb",
    profile_url: "https://csci3100project.s3.ap-southeast-1.amazonaws.com/img2",
  },
];

// const registerUrl = "/api/user/register";
// const loginUrl = "/api/user/login";
// const getProfileUrl = "/api/user";
// const updateProfileUrl = "/api/user/profile";

describe("Get User Profile", () => {
  jest.mock("prisma");
  jest.mock("../../AWS/s3Cient");
  // return an error for the first call, return null afterwards to indicate that the profile exists  // delete
  // s3Client_mock.send = jest.fn().mockRejectedValueOnce(new Error("cannot find profile")).mockResolvedValue();   // delete

  // it("Should give the corresponding user info given a valid user_id", async () => {
  // return an error for the first call, return null afterwards to indicate that the profile exists
  // s3Client_mock.send = jest.fn().mockRejectedValueOnce(new Error("cannot find profile")).mockResolvedValue();
  //   let id = userArray[0].id;
  //   let name = userArray[0].name;
  //   let email = userArray[0].email;
  //   let profile_url = userArray[0].profile_url;

  //   let req = { query: { user_id: id } };
  //   let res = { send: jest.fn() };
  //   let next = jest.fn();

  //   prisma.user.findUnique = jest.fn().mockResolvedValue({
  //     name: name,
  //     email: email,
  //   });

  //   // test the case that the user has never uploaded an profile pic
  //   let result = await getProfile(req, res, next);
  //   expect(res.send).toBeCalledWith({
  //     name: name,
  //     email: email,
  //     profile_url: null,
  //   });

  //   // test the case that the user already has a profile pic
  //   result = await getProfile(req, res, next);
  //   expect(res.send).toBeCalledWith({
  //     name: name,
  //     email: email,
  //     profile_url: "https://csci3100project.s3.ap-southeast-1.amazonaws.com/img" + String(id),
  //   });
  // });

  it.each(userArray)(
    "Should give the corresponding user info of user $id",
    async ({ id, email, name, password, profile_url }) => {
      let req = { query: { user_id: id } };
      let res = { send: jest.fn() };
      let next = jest.fn();

      prisma.user.findUnique = jest.fn().mockResolvedValue({
        name: name,
        email: email,
      });

      if (profile_url) {
        s3Client_mock.send = jest.fn().mockResolvedValue(); // if profile_url is not null, return null to indicate that the profile exists
      } else {
        s3Client_mock.send = jest.fn().mockRejectedValueOnce(new Error("cannot find profile")); // Otherwise, return an error for the first call
      }

      let result = await getProfile(req, res, next);
      expect(res.send).toBeCalledWith({
        name: name,
        email: email,
        profile_url: profile_url,
      });
    }
  );

  it("Should give 401 HTTP exception if no user is found", async () => {
    const req = { query: { user_id: 10 } };
    const res = { send: jest.fn() };
    const next = jest.fn();

    // jest.mock("prisma");
    // jest.mock("../../AWS/s3Cient");

    prisma.user.findUnique = jest.fn().mockResolvedValue(null);

    const result = await getProfile(req, res, next);

    expect(next).toBeCalledWith(new HttpException(401, "Cannot find user"));
  });
});

// -----------------------------------------------------------------------------

// describe("Update User Profile", () => {
//   it("Should return 422 if no param", async () => {
//     const res = await request(app).post(url);
//     expect(res.status).toBe(422);
//   });

//   it("Should return 201 if successful", async () => {
//     const payload = {
//       name: userArray[0].name,
//       email: userArray[0].email,
//       password: userArray[0].password,
//     };

//     const res = await request(app).post(url).send(payload);
//     expect(res.status).toBe(201);
//   });

//   it("Should return 409 if user already registered", async () => {
//     await prisma.user.create({
//       data: {
//         ...userArray[1],
//       },
//     });

//     const payload = {
//       name: userArray[1].name,
//       email: userArray[1].email,
//       password: userArray[1].password,
//     };

//     const res = await request(app).post(url).send(payload);
//     expect(res.status).toBe(409);
//   });
// });
