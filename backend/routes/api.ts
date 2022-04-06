/**
 * Required External Modules and Interfaces
 */
import express from "express";
import * as userController from "../controllers/userController";
import * as adminController from "../controllers/adminController";
import * as friendController from "../controllers/friendController";
import * as eventController from "../controllers/eventController";
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
userRouter.get("/", authMiddleware, userController.validateGetProfile, userController.getProfile);
userRouter.put("/profile", authMiddleware, userController.validateProfile, userController.updateProfile);

userRouter.get("/browse", authMiddleware, userController.browseEvent);
userRouter.put("/join", authMiddleware, userController.validateEvent, userController.joinEvent);
userRouter.put("/save", authMiddleware, userController.validateEvent, userController.saveEvent);
userRouter.post("/comment", authMiddleware, userController.validateComment, userController.postComment);

userRouter.post("/forget_pw", userController.forgetPassword);
userRouter.post("/pw_reset", userController.validateNewPassword, userController.resetPassword);

userRouter.post("/verify", userController.validateVerifyEmail, userController.verifyEmail);

// -----------------------------------------------------------------------------

const adminRouter = express.Router();
router.use("/admin", authMiddleware, adminMiddleware, adminRouter);

adminRouter.get("/", adminController.getUser);
adminRouter.put("/", adminController.validateUpdate, adminController.updateUser);
adminRouter.delete("/", adminController.validateDelete, adminController.deleteUser);

// -----------------------------------------------------------------------------

const friendRouter = express.Router();
router.use("/friend", authMiddleware, friendRouter);

friendRouter.get("/", friendController.get);
friendRouter.put("/request", friendController.validate, friendController.request);
friendRouter.put("/accept", friendController.validate, friendController.accept);
friendRouter.delete("/", friendController.validate, friendController.remove);

// -----------------------------------------------------------------------------

const eventRouter = express.Router();
router.use("/event", authMiddleware, eventRouter);

eventRouter.get("/", eventController.validateGet, eventController.get);
eventRouter.put("/", eventController.validateUpsert, eventController.upsert);
eventRouter.post("/", eventController.validateUpsert, eventController.upsert);
eventRouter.delete("/", eventController.validateRemove, eventController.remove);

// -----------------------------------------------------------------------------

export default router;
