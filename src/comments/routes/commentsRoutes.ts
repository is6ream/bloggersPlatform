import { Router } from "express";
import { accessTokenGuard } from "../../core/guards/access.token.guard";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import { deleteCommentHandler } from "../handlers/deleteCommentHandler";
import { updateCommentHandler } from "../handlers/updateCommentHandler";
import { getCommentByIdHandler } from "../handlers/getAllCommentsHandler";
import { commentValidator } from "../../core/middlewares/commentValidation/comment-input-dto.validation";

export const commentsRouter = Router();

commentsRouter
  .get("/:id", idValidation, getCommentByIdHandler)
  .delete(
    "/:id",
    accessTokenGuard,
    idValidation,
    inputValidationResultMiddleware,
    deleteCommentHandler,
  )
  .put(
    "/:id",
    accessTokenGuard,
    idValidation,
    commentValidator,
    inputValidationResultMiddleware,
    updateCommentHandler,
  );
