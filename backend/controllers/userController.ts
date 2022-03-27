import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import prisma, { prismaErrorHandler } from "../common/dbClient";
import HttpException from "../common/httpException";
import { generateFriendsList, generateFOFList } from "../services/friendService";

import bcrypt from "bcrypt";
import { generateJWT } from "../services/authService";
import { eventPrivacy, EventPrivacyType } from "../types/sharedTypes";

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
    role: user.role,
  });
};

// -----------------------------------------------------------------------------

// middleware: auth
export function getProfile(req: Request, res: Response) {
  const { id, email } = req;

  res.send({ id, email });
}

// -----------------------------------------------------------------------------

export const browseEvent = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.id;

  let user;
  try {
    user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  if (!user) {
    return next(new HttpException(404, "User not found"));
  }

  const friendsList = (await generateFriendsList(user_id)) as number[];
  const fofList = (await generateFOFList(user_id)) as number[];

  let result;
  try {
    result = await prisma.event.findMany({
      where: {
        OR: [
          {
            ownerId: user_id,
            privacy: eventPrivacy[0] as EventPrivacyType,
          },
          {
            ownerId: { in: friendsList },
            privacy: eventPrivacy[1] as EventPrivacyType,
          },
          {
            ownerId: { in: fofList },
            privacy: eventPrivacy[2] as EventPrivacyType,
          },
          {
            privacy: eventPrivacy[3] as EventPrivacyType,
          },
        ],
      },
    });
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  res.status(201).send({ event: result });
};

// -----------------------------------------------------------------------------

export const validateEvent = [body("event_id").isInt()];

export const joinEvent = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpException(422, "Invalid input"));
  }

  const user_id = req.id;
  const event_id = req.body.event_id;

  let event;
  try {
    event = await prisma.event.findUnique({
      where: {
        id: event_id,
      },
      include: {
        _count: { select: { participants: true } },
      },
    });
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

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

  res.status(201).send({ participants: [...newJoin.participants] });
};

// -----------------------------------------------------------------------------

export const saveEvent = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpException(422, "Invalid input"));
  }

  const user_id = req.id;
  const event_id = req.body.event_id;

  let event;
  try {
    event = await prisma.event.findUnique({
      where: {
        id: event_id,
      },
    });
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  if (!event) {
    return next(new HttpException(404, "Event not found"));
  }

  let newSave;
  try {
    newSave = await prisma.event.update({
      where: {
        id: event_id,
      },
      data: {
        followers: { connect: { id: user_id } },
      },
      include: {
        followers: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  res.status(201).send({ followers: [...newSave.followers] });
};

// -----------------------------------------------------------------------------

export const validateComment = [body("event_id").isInt(), body("comment").exists()];

export const postComment = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpException(422, "Invalid input"));
  }

  const user_id = req.id;
  const { event_id, comment } = req.body;

  let result;
  try {
    result = await prisma.event.findUnique({
      where: {
        id: event_id,
      },
    });
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  if (!result) {
    return next(new HttpException(404, "Event not found"));
  }

  let newComment;
  try {
    newComment = await prisma.eventComment.create({
      data: {
        eventId: event_id,
        text: comment,
      },
    });
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  let event;
  try {
    event = await prisma.event.update({
      where: {
        id: event_id,
      },
      data: {
        comments: {
          connect: { id: newComment.id },
        },
      },
      include: {
        comments: true,
      },
    });
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  res.status(201).send({ comments: event.comments });
};

// -----------------------------------------------------------------------------
