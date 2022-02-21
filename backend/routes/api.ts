/**
 * Required External Modules and Interfaces
 */
import express from "express";
import * as userController from "../controllers/userController";
import authMiddleware from "../middleware/authMiddleware";

/**
 * Router Definition
 */

const router = express.Router();

router.post("/user/register", userController.validateRegister, userController.register);
router.post("/user/login", userController.validateLogin, userController.login);

router.get("/user/", authMiddleware, userController.getProfile);

export default router;
