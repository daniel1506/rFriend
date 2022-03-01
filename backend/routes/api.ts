/**
 * Required External Modules and Interfaces
 */
import express from "express";
import * as userController from "../controllers/userController";
import * as adminController from "../controllers/adminController";
import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";

/**
 * Router Definition
 */

const router = express.Router();

router.post("/user/register", userController.validateRegister, userController.register);
router.post("/user/login", userController.validateLogin, userController.login);

router.get("/user/", authMiddleware, userController.getProfile);

router.get("/admin/", authMiddleware, adminMiddleware, adminController.getUser);

router.put("/admin/", authMiddleware, adminMiddleware, adminController.validateUpdate, adminController.updateUser);

router.delete("/admin/", authMiddleware, adminMiddleware, adminController.validateDelete, adminController.deleteUser);

export default router;
