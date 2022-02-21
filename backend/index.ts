/**
 * Required External Modules
 */
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import apiRouter from "./routes/api";
import webRouter from "./routes/web";

import errorMiddleware from "./middleware/errorMiddleware";
import notFoundMiddleware from "./middleware/notFoundMiddleware";

dotenv.config();

/**
 * App Variables
 */

const app = express();
const PORT = process.env.PORT || 3000;

/**
 *  App Configuration
 */

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);
app.use("/", webRouter);

app.use(errorMiddleware);
app.use(notFoundMiddleware);

/**
 * Server Activation
 */

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
