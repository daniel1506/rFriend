import { NextFunction, Request, Response } from "express";
import HttpException from "../common/httpException";

import jwt from "jsonwebtoken";
import { JWTpayload } from "../services/authService";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["x-auth-token"];

  if (!token) {
    return next(new HttpException(401, "Unauthorized, no token"));
  }

  try {
    const decodedData = jwt.verify(
      token.toString(),
      process.env.JWT_SECRET!
    ) as JWTpayload;
    req.id = decodedData.id;
    req.email = decodedData.email;
    next();
  } catch (e) {
    return next(new HttpException(401, "Unauthorized, invalid token"));
  }
};

export default authMiddleware;
