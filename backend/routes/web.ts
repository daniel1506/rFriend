/**
 * Required External Modules and Interfaces
 */
import express, { Response } from "express";
import path from "path";

/**
 * Router Definition
 */

const router = express.Router();

const frontendLocation = path.resolve(__dirname + process.env.FRONTEND_MOUNT_LOCATION);

// serve `/static` folder statically
router.use(express.static(frontendLocation));

// serve everything else to index.html
router.get("*", (_, res: Response) => {
  res.sendFile(path.resolve(frontendLocation + "/index.html"));
});

export default router;
