import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import prisma, { prismaErrorHandler } from "../common/dbClient";
import HttpException from "../common/httpException";
import { getProfileUrl } from "./userController";

export const validate = [body("target_user_id").isInt().toInt()];

export const request = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpException(422, "Invalid input"));
  }

  const { id } = req;
  const target_user_id = req.body.target_user_id as number;

  if (id === target_user_id) {
    return next(new HttpException(409, "Cannot send requeset to self"));
  }

  let isUsersFriends: boolean;
  try {
    const usersFriends = await prisma.user.findFirst({
      where: { id: id },
      select: {
        friends: {
          where: {
            id: target_user_id,
          },
        },
      },
    });
    isUsersFriends = usersFriends?.friends.length !== 0;
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  if (isUsersFriends) {
    return next(new HttpException(409, "User is already friends with the target"));
  }

  let existingFriendRequests;
  try {
    existingFriendRequests = await prisma.friendRquest.findFirst({
      where: {
        OR: [
          { fromUser: id, toUser: target_user_id },
          { fromUser: target_user_id, toUser: id },
        ],
        acceptedAt: null,
      },
    });
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  if (existingFriendRequests) {
    return next(new HttpException(409, "Existing friend request pending"));
  }

  let newFriendRequest;
  try {
    newFriendRequest = await prisma.friendRquest.upsert({
      where: {
        fromUser_toUser: {
          fromUser: id,
          toUser: target_user_id,
        },
      },
      update: {
        acceptedAt: null,
      },
      create: {
        fromUser: id,
        toUser: target_user_id,
      },
    });
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  res.status(201).send({ ...newFriendRequest });
};

// -----------------------------------------------------------------------------

export const accept = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpException(422, "Invalid input"));
  }

  const { id } = req;
  const target_user_id = req.body.target_user_id as number;

  let request;
  try {
    request = await prisma.friendRquest.update({
      where: {
        fromUser_toUser: {
          fromUser: target_user_id,
          toUser: id,
        },
      },
      data: {
        acceptedAt: new Date(),
      },
    });
  } catch (e) {
    return next(new HttpException(409, "Existing friend request not found"));
  }

  let user;
  try {
    user = await prisma.user.update({
      where: { id },
      data: {
        friends: { connect: { id: target_user_id } },
      },
      include: {
        friends: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  res.send({ friends: user.friends });
};

// -----------------------------------------------------------------------------

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpException(422, "Invalid input"));
  }

  const { id } = req;
  const target_user_id = req.body.target_user_id as number;

  let user;
  try {
    user = await prisma.user.update({
      where: { id },
      data: {
        friends: { disconnect: { id: target_user_id } },
      },
      include: {
        friends: {
          select: { id: true, name: true, email: true },
        },
        friendsOf: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  let friends = [...user!.friends, ...user!.friendsOf];
  friends = friends.map((friend) => ({
    ...friend,
    profile_url: getProfileUrl(friend.id),
  }));

  res.send({ friends });
};

// -----------------------------------------------------------------------------

export const get = async (req: Request, res: Response, next: NextFunction) => {
  const target_user_id = req.body.target_user_id as number;

  // check if target user exists
  try {
    const targetUser = await prisma.user.findFirst({
      where: { id: target_user_id },
    });

    if (!targetUser) {
      return next(new HttpException(404, "User not found"));
    }
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  // query friends of the target user
  let user;
  try {
    user = await prisma.user.findFirst({
      where: { id: target_user_id },
      include: {
        friends: {
          select: { id: true, name: true, email: true },
        },
        friendsOf: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  } catch (e) {
    return next(prismaErrorHandler(e));
  }

  let friends = [...user!.friends, ...user!.friendsOf];
  friends = friends.map((friend) => ({
    ...friend,
    profile_url: getProfileUrl(friend.id),
  }));

  res.send({ friends });
};
