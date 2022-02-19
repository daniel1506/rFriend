/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from "express";

/**
 * Router Definition
 */

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const query = req.query;
  const params = req.params;

  res.status(200).send({ data: { ...query, ...params } });
});

export default router;
