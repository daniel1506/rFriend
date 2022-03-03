import HttpException from "../common/httpException";
import { Request, Response, NextFunction } from "express";

const errorHandler = (error: HttpException, request: Request, response: Response, next: NextFunction) => {
  const status = error.statusCode || error.status || 500;

  response.status(status).send(error);
};

export default errorHandler;
