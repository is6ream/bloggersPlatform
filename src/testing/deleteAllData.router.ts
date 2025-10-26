import { Router } from "express";
import { HttpStatus } from "../core/http-statuses";
import { Request, Response } from "express";
import {
  commentsCollection,
  postCollection,
  sessionCollection,
  userCollection,
} from "../db/mongo.db";
import { BlogModel } from "../blogs/types/mongoose";

export const testingRouter = Router();

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
  await Promise.all([
    BlogModel.deleteMany(),
    postCollection.deleteMany(),
    userCollection.deleteMany(),
    commentsCollection.deleteMany(),
    sessionCollection.deleteMany(),
  ]);
  res.sendStatus(HttpStatus.NoContent);
});
