import { Prisma } from "@prisma/client";
import prisma from "../common/dbClient";

export const generateFriendsList = async (userId: number) => {
  const user = await prisma.user.findFirst({
    where: { id: userId },
    include: {
      friends: { select: { id: true } },
      friendsOf: { select: { id: true } },
    },
  });

  const friendsList = [
    userId,
    ...user!.friends.map((friend) => friend.id),
    ...user!.friendsOf.map((friend) => friend.id),
  ];
  return friendsList;
};

export const generateFOFList = async (userId: number) => {
  const userIncludeUserFriends: Prisma.UserInclude = {
    friends: { select: { id: true } },
    friendsOf: { select: { id: true } },
  };

  const user = await prisma.user.findFirst({
    where: { id: userId },
    include: {
      friends: {
        include: userIncludeUserFriends,
      },
      friendsOf: {
        include: userIncludeUserFriends,
      },
    },
  });
  let friendsList = [
    userId,
    ...user!.friends.map((friend: any) => [
      friend.id,
      ...friend.friends.map((friend: any) => friend.id),
      ...friend.friendsOf.map((friend: any) => friend.id),
    ]),
    ...user!.friendsOf.map((friend: any) => [
      friend.id,
      ...friend.friends.map((friend: any) => friend.id),
      ...friend.friendsOf.map((friend: any) => friend.id),
    ]),
  ];
  friendsList = [...new Set(friendsList.flat())];
  return friendsList;
};
