import { Router } from "express";
import { accessTokenGuard } from "../../core/guards/access.token.guard";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import { commentValidator } from "../../core/middlewares/commentValidation/comment-input-dto.validation";
import { container } from "../../container";
import { CommentsController } from "../controller/commentsController";
import { CommentsQueryController } from "../controller/commentsQueryController";
import { likeStatusValidator } from "../../likes/likeStatusValidator";
import { optionalGuard } from "../../core/guards/optionalGuard";

export const commentsRouter = Router();
const commentsController = container.get(CommentsController);
const commentsQueryController = container.get(CommentsQueryController);
commentsRouter
  .get(
    "/:id",
    optionalGuard,
    idValidation,
    commentsQueryController.getCommentById.bind(commentsQueryController),
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
  )
  .put(
    "/:id/like-status",
    accessTokenGuard,
    idValidation,
    likeStatusValidator,
    inputValidationResultMiddleware,
    commentsController.updateLikeStatus.bind(commentsController),
  );
