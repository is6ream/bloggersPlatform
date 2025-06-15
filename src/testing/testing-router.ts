import { Router } from "express";
import { deleteAllPosts } from "../posts/handlers/deleteAllPostsHandler";
import { deleteAllBlogs } from "../blogs/routes/handlers/deleteAllBlogsHandler";
import { deleteBlogHandler } from "../blogs/routes/handlers/deleteBlogHandler";

export const testingRouter = Router();

testingRouter.delete("/all-data", deleteAllPosts);
testingRouter.delete("/all-data", deleteAllBlogs);
