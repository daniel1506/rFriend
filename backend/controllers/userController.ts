import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import prisma, { prismaErrorHandler } from "../common/dbClient";
import HttpException from "../common/httpException";

import bcrypt from "bcrypt";
import { generateJWT } from "../services/authService";

// -----------------------------------------------------------------------------

export const validateRegister = [
  body("name").isLength({ min: 4 }),
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
];

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpException(422, "Invalid input"));
  }

  const { name, email, password } = req.body;

  const isEmailRegistered = await prisma.user.findFirst({
    where: { email },
  });
  if (isEmailRegistered) {
    return next(new HttpException(409, "User already registered"));
  }

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

  res.status(201).send({
    id: result.id,
    email: result.email,
    name: result.name,
    token: token,
  });
};

// -----------------------------------------------------------------------------

export const validateLogin = [body("email").isEmail(), body("password").exists()];

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpException(422, "Invalid input"));
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
    return next(new HttpException(401, "Unauthorized"));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new HttpException(401, "Unauthorized"));
  }

  // user found
  const token = generateJWT(user.id, user.email);

  res.send({
    id: user.id,
    email: user.email,
    name: user.name,
    token: token,
  });
};

// -----------------------------------------------------------------------------

// middleware: auth
export function getProfile(req: Request, res: Response) {
  const { id, email } = req;

  res.send({ id, email });
}

// -----------------------------------------------------------------------------

export const validateJoin = [body("event_id").isInt()];

export const joinEvent = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpException(422, "Invalid input"));
  }

  const user_id = req.id;
  const event_id = req.body.event_id;

  const event = await prisma.event.findUnique({
    where: {
      id: event_id,
    },
    include: {
      _count: { select: { participants: true } },
    },
  });

  if (!event) {
    return next(new HttpException(404, "Event not found"));
  }

  if (event._count.participants == event.maxParticipants) {
    return next(new HttpException(422, "Event is full"));
  }

  let newJoin;
  try {
    newJoin = await prisma.event.update({
      where: {
        id: event_id,
      },
      data: {
        participants: { connect: { id: user_id } },
      },
      include: {
        participants: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  res.send({ participants: [...newJoin.participants] });
};
