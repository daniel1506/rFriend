/**
 * Required External Modules and Interfaces
 */
import prisma from "../common/dbClient";
import express, { Request, Response } from "express";
import * as userController from "../controllers/userController";

/**
 * Router Definition
 */

const router = express.Router();

router.post(
  "/user/register",
  userController.validateRegister,
  userController.register
);

export default router;
