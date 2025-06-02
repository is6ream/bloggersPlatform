import { Router } from "express";
import { getAllPostsHandler } from "../handlers/getAllpostsHandler";
import { createPostHandler } from "../handlers/createPostHandler";
import { findPostHandler } from "../handlers/findPostHandler";
import { updatePostHandler } from "../handlers/updatePostHandler";
import { deletePostHandler } from "../handlers/deletePostHandler";
import { superAdminGuardMiddleware } from "../../core/middlewares/validation/super-admin.guard-middleware";

export const postRouter = Router();

postRouter
  .get("/", getAllPostsHandler)
  .post("/", superAdminGuardMiddleware, createPostHandler)
  .get("/:id", findPostHandler)
  .put("/:id", updatePostHandler)
  .delete("/:id", deletePostHandler);
