import { Router } from "express";
import { deleteAllPosts } from "../posts/handlers/deleteAllPostsHandler";
import { deleteAllBlogs } from "../blogs/routes/handlers/deleteAllBlogsHandler";
import { HttpStatus } from "../core/http-statuses";
import { Request, Response } from "express";
export const testingRouter = Router();

async function deleteAllData(req: Request, res: Response) {
  try {
    deleteAllBlogs;
    deleteAllPosts;

    res.sendStatus(HttpStatus.NoContent);
    return;
  } catch (error: unknown) {
    console.log("Error deleting all data: ", error);
    res.sendStatus(HttpStatus.InternalServerError);
    return;
  }
}

testingRouter.delete("/all-data", deleteAllData);
