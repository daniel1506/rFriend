import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import prisma, { prismaErrorHandler } from "../common/dbClient";
import HttpException from "../common/httpException";

import bcrypt from "bcrypt";
import { generateJWT } from "../services/authService";

import {PutObjectCommand, PutObjectCommandInput} from "@aws-sdk/client-s3";
import { s3Client } from "../AWS/s3Cient";
import { stringify } from "querystring";
import { runMain } from "module";

// -----------------------------------------------------------------------------

export const validateRegister = [
  body("name").isLength({ min: 4 }),
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
];

export const register = async (req: Request, res: Response, next: NextFunction) => { console.log("hello world\n", req.body   );
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
// middleware: auth
export function forgetPassword(req: Request, res: Response) {
  const { id, email } = req;

  res.send({ id, email });
}

// -----------------------------------------------------------------------------
// middleware: auth
export const validateProfile = [body("profile").exists(), body("profile").isString()];

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpException(422, "Invalid input"));
  }

  // const {user_id, profile : encoded_image} = req.body;
  const {user_id, profile} = req.body;

  /* 
    find out the type of the image
    Note that profile has the format: image/jpeg;base64,xxxx.....
  */
  let type: string = profile.split("/")[1].split(";")[0];
  let key: string = "img" + String(user_id);
  
  // turn the string into binary data. The image cannot be shown without doing this
  const encoded_image: Buffer = Buffer.from(profile.split(',')[1], "base64"); 

  // Set the parameters.
  const bucketParams: PutObjectCommandInput = {
    Bucket: process.env.BUCKET_NAME,
    // Specify the name of the new object. For example, 'index.html'.
    // To create a directory for the object, use '/'. For example, 'myApp/package.json'.
    Key: key,
    Body: encoded_image,  // Content of the new object.
    ContentEncoding: "base64",
    ContentType: "image/" + type,
    ACL: 'public-read'   // for public access
  };

  // Create and upload the object to the S3 bucket.
  try {
    const data = await s3Client.send(new PutObjectCommand(bucketParams));
    
    console.log("Successfully uploaded object: " + bucketParams.Bucket + "/" + bucketParams.Key);
    console.log(data);

    // generate an url for the image
    let profileURL : String = "https://" + process.env.BUCKET_NAME + ".s3." + process.env.REGION + ".amazonaws.com/" + key;

    res.status(200).send(
      {profileURL: profileURL}
      );

   // Store the url into the database

  } catch (err) {
    return next(new HttpException(500, "Error in AWS."));
  }


}

// -----------------testing (delete)--------------
import {ListBucketsCommand} from "@aws-sdk/client-s3";
export const testing = async (req: Request, res: Response, next: NextFunction)=>{
  try {
    console.log(process.env.AWS_ACCESS_KEY_ID);
    const data = await s3Client.send(new ListBucketsCommand({}));
    console.log("Success", data.Buckets);
    res.send(data);
  } catch (err) {
    console.log("Error", err);
    res.send(err);
  }
}


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

  res.send({ participants: [...newJoin.participants] });
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

  res.send({ followers: [...newSave.followers] });
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

  res.send({ comments: event.comments });
};

// -----------------------------------------------------------------------------
