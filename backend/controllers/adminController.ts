import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import prisma, { prismaErrorHandler } from "../common/dbClient";
import HttpException from "../common/httpException";
import bcrypt from "bcrypt";

// -----------------------------------------------------------------------------

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  let user;
  try {
    user = await prisma.user.findMany();
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  res.status(201).send(user);
};

// -----------------------------------------------------------------------------

export const validateUpdate = [body("userId").isInt(), body("password").isLength({ min: 8 })];

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpException(422, "Invalid input"));
  }

  const { userId, password } = req.body;

  let user;
  try {
    user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  if (!user) {
    return next(new HttpException(404, "User not found"));
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  let result;
  try {
    result = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hash,
      },
    });
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  res.status(201).send({ message: "Password updated" });
};

// -----------------------------------------------------------------------------

export const validateDelete = [body("userId").isInt()];

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpException(422, "Invalid input"));
  }

  const userId = req.body.userId;

  let user;
  try {
    user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  if (!user) {
    return next(new HttpException(404, "User not found"));
  }

  let result;
  try {
    result = await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  res.status(201).send({ message: "User deleted" });
};
