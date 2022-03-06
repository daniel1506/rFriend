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

// -----------------------------------------------------------------------------

const userRouter = express.Router();
router.use("/user", userRouter);

userRouter.post("/register", userController.validateRegister, userController.register);
userRouter.post("/login", userController.validateLogin, userController.login);
userRouter.get("/", authMiddleware, userController.getProfile);
userRouter.put("/join", authMiddleware, userController.validateJoin, userController.joinEvent);

// -----------------------------------------------------------------------------

const adminRouter = express.Router();
router.use("/admin", authMiddleware, adminMiddleware, adminRouter);

adminRouter.get("/", adminController.getUser);
adminRouter.put("/", adminController.validateUpdate, adminController.updateUser);
adminRouter.delete("/", adminController.validateDelete, adminController.deleteUser);

// -----------------------------------------------------------------------------

export default router;
