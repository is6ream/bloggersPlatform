import { Router } from "express";
import { deleteAllPosts } from "../posts/handlers/deleteAllPostsHandler";
import { deleteAllBlogs } from "../blogs/routes/handlers/deleteAllBlogsHandler";
import { HttpStatus } from "../core/http-statuses";
import { Request, Response } from "express";
export const testingRouter = Router();

async function deleteAllData(req: Request, res: Response) {
  try {
    await deleteAllBlogs(req, res);
    await deleteAllPosts(req, res);

    res.sendStatus(HttpStatus.NoContent);
  } catch (error: unknown) {
    console.log("Error deleting all data: ", error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}

testingRouter.delete("/all-data", deleteAllData);
