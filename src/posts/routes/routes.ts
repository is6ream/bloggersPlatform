import { Router } from "express";
import { getAllPostsHandler } from "../handlers/getAllpostsHandler";
import { createPostHandler } from "../handlers/createPostHandler";
import { findPostHandler } from "../handlers/findPostHandler";
import { updatePostHandler } from "../handlers/updatePostHandler";
import { deletePostHandler } from "../handlers/deletePostHandler";

export const postRouter = Router();

postRouter
  .get("/", getAllPostsHandler)
  .post("/", createPostHandler)
  .get("/:id", findPostHandler)
  .put("/:id", updatePostHandler)
  .delete("/:id", deletePostHandler);
