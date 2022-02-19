import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import prisma, { prismaErrorHandler } from "../common/dbClient";
import HttpException from "../common/httpException";

import bcrypt from "bcrypt";
import { generateJWT } from "../services/authService";

export const validateRegister = [
  body("name").isLength({ min: 4 }),
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
];

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpException(422, "", "Invalid input"));
  }

  const { name, email, password } = req.body;

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // save to db
  let result;
  try {
    result = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hash,
      },
    });
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  // generate token
  const token = generateJWT(result.id, result.email);

  res.status(200).send({
    id: result.id,
    email: result.email,
    name: result.name,
    token: token,
  });
};

// -----------------------------------------------------------------------------

export const validateLogin = [
  body("email").isEmail(),
  body("password").exists(),
];

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpException(422, "", "Invalid input"));
  }

  const { email, password } = req.body;

  let user;
  try {
    user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  if (!user) {
    return next(new HttpException(401, "", "Unauthorized"));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new HttpException(401, "", "Unauthorized"));
  }

  // user found
  const token = generateJWT(user.id, user.email);

  res.status(200).send({
    id: user.id,
    email: user.email,
    name: user.name,
    token: token,
  });
};
