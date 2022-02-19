import { Prisma, PrismaClient } from "@prisma/client";
import HttpException from "./httpException";

let prisma = new PrismaClient();

export const prismaErrorHandler = (e: any) => {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    return new HttpException(500, e.message);
  } else {
    return new HttpException(500, "Unknown Prisma Exception");
  }
};

export default prisma;
