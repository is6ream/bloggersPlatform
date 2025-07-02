import { Router } from "express";
import { HttpStatus } from "../core/http-statuses";
import { Request, Response } from "express";
import {
  blogCollection,
  postCollection,
  authColletction,
} from "../db/mongo.db";
export const testingRouter = Router();

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
  Promise.all([
    blogCollection.deleteMany(),
    postCollection.deleteMany(),
    authColletction.deleteMany(),
  ]);
  res.sendStatus(HttpStatus.NoContent);
});
