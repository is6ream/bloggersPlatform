import { Router } from "express";
import { HttpStatus } from "../core/http-statuses";
import { Request, Response } from "express";
import { BlogModel } from "../blogs/types/mongoose";
import { UserModel } from "../users/types/usersMongoose";
import { PostModel } from "../posts/types/postMongoose";
import { CommentModel } from "../comments/types/mongoose/mongoose";
import { SessionModel } from "../securityDevices/types/securityDevicesMongoose";

export const testingRouter = Router();

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
  await Promise.all([
    BlogModel.deleteMany(),
    PostModel.deleteMany(),
    UserModel.deleteMany(),
    CommentModel.deleteMany(),
    SessionModel.deleteMany(),
  ]);
  res.sendStatus(HttpStatus.NoContent);
});
