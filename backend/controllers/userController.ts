// import { NextFunction, query, Request, Response } from "express";
import { NextFunction, Request, Response } from "express";
// import { body, param, validationResult } from "express-validator";
import { body, query, validationResult } from "express-validator";
import prisma, { prismaErrorHandler } from "../common/dbClient";
import HttpException from "../common/httpException";
import { generateFriendsList, generateFOFList } from "../services/friendService";

import bcrypt from "bcrypt";
import { generateJWT, JWTpayload } from "../services/authService";
import { eventPrivacy, EventPrivacyType } from "../types/sharedTypes";

import { HeadObjectCommand, HeadObjectCommandInput } from "@aws-sdk/client-s3";
import { s3Client } from "../AWS/s3Cient";

import jwt from "jsonwebtoken";

import { sendEmail, generateForgetPasswordEmail, sendVerifyEmailEmail } from "../services/emailService";
import photoUploadS3 from "../AWS/photoUploader";

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

  sendVerifyEmailEmail(result.id, result.name, result.email);

  // generate token
  const token = generateJWT(result.id, result.email);

  res.status(201).send({
    id: result.id,
    email: result.email,
    name: result.name,
    token: token,
    role: result.role,
    verified_at: result.verfiedAt,
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
    verified_at: user.verfiedAt,
  });
};

// -----------------------------------------------------------------------------

// middleware: auth
export const validateGetProfile = [query("user_id").exists().isInt()];

export const getProfileUrl = (userId: number): string => {
  const key = "img" + String(userId);
  const url = "https://" + process.env.BUCKET_NAME + ".s3." + process.env.REGION + ".amazonaws.com/" + key;
  return url;
};

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpException(422, "Invalid input"));
  }

  const id: number = Number(req.query.user_id);

  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
      include: { participatesIn: true },
    });

    if (!user) {
      return next(new HttpException(401, "Cannot find user"));
    }

    let response_content: { name: string; email: string; profile_url: string | null } = {
      name: user.name,
      email: user.email,
      profile_url: null,
    };

    const params: HeadObjectCommandInput = {
      Bucket: process.env.BUCKET_NAME,
      Key: "img" + String(id), //if any sub folder-> path/of/the/folder.ext
    };
    try {
      const header = await s3Client.send(new HeadObjectCommand(params));
      
      response_content["profile_url"] = getProfileUrl(id);

      res.send(response_content);
    } catch (err) {
      res.send(response_content);
    }
  } catch (e) {
    return next(prismaErrorHandler(e));
  }
}

// -----------------------------------------------------------------------------
// middleware: auth
export async function forgetPassword(req: Request, res: Response, next: NextFunction) {
  // const { id, email } = req;
  const { email } = req.body;

  let user;
  try {
    user = await prisma.user.findUnique({
      where: { email: email },
    });

    // first check if the email exist
    if (!user) {
      return next(new HttpException(400, "Email does not exist."));
    }
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  // If the email exists, generate a token using another jwt_secret, different from authentication
  const token: string = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET_FORGET_PW!,
    { expiresIn: "1h" } //expire in an hour
  );

  // store/update the token into the DB
  try {
    user = await prisma.user.update({
      where: { email: email },
      data: { resetPasswordToken: token },
    });

    
    if (!user) {
      return next(new HttpException(400, "Cannot update token for forget password."));
    }
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  try {
    // send a recovery email with the token
    let email_content: string = generateForgetPasswordEmail(token);
    let email_title: string = "Change password for rFriend: " + email;
    sendEmail(email, email_title, email_content);

    res.send({ user_id: user.id, email: user.email, token: token });
  } catch (e) {
    return next(new HttpException(400, "Cannot send email"));
  }
}

// -----------------------------------------------------------------------------
// middleware: auth
export const validateNewPassword = [body("password").isLength({ min: 8 })];

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpException(422, "Invalid input"));
  }
  console.log("new test ---------------------------")  //delete
  const { password, token } = req.body;

  // check if the forget password token is valid (i.e. not yet expired and exists in the DB)
  try {
    jwt.verify(token, process.env.JWT_SECRET_FORGET_PW!);
  } catch (e) {console.log("expired")  //delete
    return next(new HttpException(401, "Forget password token expired"));
  }

  let user;
  try {
    // use findFirst since profileUrl may be null, and hence not unique. However, it is unique if exists
    user = await prisma.user.findFirst({
      where: { resetPasswordToken: token },
    });
    console.log(user);    //  delete
    // first check if the email exist
    if (!user) {console.log("invalid token")  //delete
      return next(new HttpException(401, "Invalid forget password token"));
    }
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  // save the new hashed password into the DB
  // hash password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log("resetting")  //delete
  try {
    // use updateMany since profileUrl may be null, and hence not unique. However, it is unique if exists
    user = await prisma.user.updateMany({
      where: { resetPasswordToken: token },
      data: {
        password: hash,
        resetPasswordToken: null,
      },
    });
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  res.send(user);
}

// -----------------------------------------------------------------------------
// middleware: auth
// the base64 image must start with
export const validateProfile = [body("profile").exists().isString().matches("data:image/.*;base64,.*")];

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpException(422, "Invalid input"));
  }

  const { profile } = req.body;
  let user_id: number = req.id;

  let key: string = "img" + String(user_id);

  // Create and upload the object to the S3 bucket.
  try {
    photoUploadS3(key, profile);

    console.log("Successfully uploaded object: " + process.env.BUCKET_NAME + "/" + key);

    // generate an url for the image
    let profileURL: string =
      "https://" + process.env.BUCKET_NAME + ".s3." + process.env.REGION + ".amazonaws.com/" + key;

    // Store the url into the database
    let user;

    try {
      user = await prisma.user.update({
        where: {
          id: user_id,
        },
        data: { profileUrl: profileURL },
      });
    } catch (e) {
      return next(prismaErrorHandler(e));
    }

    res.status(200).send({ profileURL: profileURL });
  } catch (err) {
    return next(new HttpException(500, "Error in AWS: " + err));
  }
};

// -----------------------------------------------------------------------------

export const browseEvent = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.id;

  let user;
  try {
    user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
      include: {
        participatesIn: true,
        interestedIn: true,
      },
    });
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  if (!user) {
    return next(new HttpException(404, "User not found"));
  }

  let joinedEvent = user.participatesIn.map((event) => event.id);
  let likedEvent = user.interestedIn.map((event) => event.id);

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
      include: {
        owner: { select: { name: true, profileUrl: true } },
        comments: { include: { owner: { select: { name: true, profileUrl: true } } } },
      },
    });
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  result.forEach((event: any) => {
    if (joinedEvent.includes(event.id)) {
      event.isEventJoined = true;
    } else {
      event.isEventJoined = false;
    }

    if (likedEvent.includes(event.id)) {
      event.isEventLiked = true;
    } else {
      event.isEventLiked = false;
    }
  });

  res.status(200).send({ event: result });
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

// -----------------------------------------------------------------------------

export const unsaveEvent = async (req: Request, res: Response, next: NextFunction) => {
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

  let unsave;
  try {
    unsave = await prisma.event.update({
      where: {
        id: event_id,
      },
      data: {
        followers: { disconnect: { id: user_id } },
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

  res.status(201).send({ followers: [...unsave.followers] });
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
        ownerId: user_id,
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
    });
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  let user;
  try {
    user = await prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        comments: {
          connect: { id: newComment.id },
        },
      },
    });
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  let eventComments;

  try {
    eventComments = await prisma.eventComment.findMany({
      where: {
        eventId: event_id,
      },
      include: { owner: { select: { name: true, profileUrl: true } } },
    });
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  res.status(201).send({ comments: eventComments });
};

// -----------------------------------------------------------------------------

export const validateVerifyEmail = [body("token").exists()];

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpException(422, "Invalid input"));
  }

  const { token } = req.body;

  try {
    const { id } = jwt.verify(token.toString(), process.env.JWT_SECRET_VERIFY_EMAIL!) as JWTpayload;

    await prisma.user.update({
      where: { id },
      data: { verfiedAt: new Date() },
    });
  } catch (e) {
    return next(new HttpException(422, "Invalid email verify token"));
  }

  res.status(200).send({});
};

// -----------------------------------------------------------------------------
