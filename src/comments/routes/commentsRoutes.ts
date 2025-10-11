import { Router } from "express";
import { accessTokenGuard } from "../../core/guards/access.token.guard";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import { commentValidator } from "../../core/middlewares/commentValidation/comment-input-dto.validation";
import {
  commentsController,
  commentsQueryController,
} from "../../compositionRoot";

export const commentsRouter = Router();

commentsRouter
  .get(
    "/:id",
    idValidation,
    commentsQueryController.getCommentById.bind(commentsController),
  )
  .delete(
    "/:id",
    accessTokenGuard,
    idValidation,
    inputValidationResultMiddleware,
    commentsController.deleteComment.bind(commentsController),
  )
  .put(
    "/:id",
    accessTokenGuard,
    idValidation,
    commentValidator,
    inputValidationResultMiddleware,
    commentsController.updateComment.bind(commentsController),
  );
