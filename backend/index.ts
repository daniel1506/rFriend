/**
 * Required External Modules
 */
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import policy from "./helmet.config";

import apiRouter from "./routes/api";
import webRouter from "./routes/web";

import errorMiddleware from "./middleware/errorMiddleware";
import notFoundMiddleware from "./middleware/notFoundMiddleware";

dotenv.config();

/**
 * App Variables
 */

const app = express();

/**
 *  App Configuration
 */

app.use(helmet.contentSecurityPolicy(policy));
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api", apiRouter);
app.use("/", webRouter);

app.use(errorMiddleware);
app.use(notFoundMiddleware);

/**
 *  Module Export
 */

export default app;
