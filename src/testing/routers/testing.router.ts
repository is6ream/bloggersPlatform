import { Router, Request, Response } from "express";
import { db } from "../../db/db";
import { HttpStatus } from "../../core/types";

export const testingRouter = Router();

testingRouter.delete("/all-data", (req: Request, res: Response) => {
  db.posts = [];
  db.blogs = [];
  res.sendStatus(HttpStatus.NoContent);
});
