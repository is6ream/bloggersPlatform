import { Router } from "express";
import { accessTokenGuard } from "../../core/guards/access.token.guard";
import { contentValidator } from "./../../core/middlewares/postValidation/post-input-dto.validation";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";

export const commentsRouter = Router();

commentsRouter.post(
  "/posts/:id/comments",
  accessTokenGuard,
  contentValidator,
  inputValidationResultMiddleware,
  createCommentHandler,
);
