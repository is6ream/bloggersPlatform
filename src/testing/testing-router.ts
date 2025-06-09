import { Router } from "express";
import { deleteAllPosts } from "../posts/handlers/deleteAllPostsHandler";
import { deleteAllBlogs } from "../blogs/handlers/deleteAllBlogsHandler";

export const testingRouter = Router();

testingRouter.delete("/all-data", deleteAllBlogs, deleteAllPosts);
