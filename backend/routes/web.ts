/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from "express";
import path from "path";

/**
 * Router Definition
 */

const router = express.Router();

router.get("/", express.static("../frontend"));

export default router;
