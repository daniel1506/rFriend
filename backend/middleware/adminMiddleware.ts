import { NextFunction, Request, Response } from "express";
import prisma, { prismaErrorHandler } from "../common/dbClient";
import HttpException from "../common/httpException";

// -----------------------------------------------------------------------------

const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.email;

    let user;
    try {
        user = await prisma.user.findUnique({
          where:{
            email: email,
          }
        });
    } catch (e) {
        return next(prismaErrorHandler(e));
    }

    if (!user) {
      return next(new HttpException(401, "Unauthorized"));
    }
      
    if (user.role == "ADMIN") {
      next();
    } else {
      return next(new HttpException(401, "Not an admin"));
    }
}

export default adminMiddleware;