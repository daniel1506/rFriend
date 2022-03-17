import request from "supertest";
import app from "../../index";

import prisma from "../../jest.setup";

// -----------------------------------------------------------------------------

const userArray = [
  { id: 1, email: "a@a.com", name: "A man", password: "somehash" },
  { id: 2, email: "b@a.com", name: "B man", password: "somehash" },
  { id: 3, email: "c@a.com", name: "C man", password: "somehash" },
];

const url = "/api/user/register";

// -----------------------------------------------------------------------------

describe("User Registration", () => {
  it("Should return 422 if no param", async () => {
    const res = await request(app).post(url);
    expect(res.status).toBe(422);
  });

  it("Should return 201 if successful", async () => {
    const payload = {
      name: userArray[0].name,
      email: userArray[0].email,
      password: userArray[0].password,
    };

    const res = await request(app).post(url).send(payload);
    expect(res.status).toBe(201);
  });

  it("Should return 409 if user already registered", async () => {
    await prisma.user.create({
      data: {
        ...userArray[1],
      },
    });

    const payload = {
      name: userArray[1].name,
      email: userArray[1].email,
      password: userArray[1].password,
    };

    const res = await request(app).post(url).send(payload);
    expect(res.status).toBe(409);
  });
});
