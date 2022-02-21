/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from "express";
import path from "path";

/**
 * Router Definition
 */

const router = express.Router();

const frontendLocation = path.resolve(
  __dirname + process.env.FRONTEND_MOUNT_LOCATION
);
router.use(express.static(frontendLocation));

export default router;
