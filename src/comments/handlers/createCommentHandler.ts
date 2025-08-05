import { HttpStatus } from "../../core/http-statuses";
import { IdType } from "../../core/types/authorization/id";
import { RequestWithParamsAndBodyAndUserId } from "../../core/types/common/requests";
import { Response } from "express";
import { commentsService } from "../application/comments.service";
import { commentsQueryRepository } from "../repositories/commentsQueryRepository";
import { ResultStatus } from "../../core/result/resultCode";
import { PostId } from "../types/commentsTypes";

export async function createCommentHandler(
  req: RequestWithParamsAndBodyAndUserId<PostId, { content: string }, IdType>,
  res: Response
) {
  try {
    const userId = req.user?.id as string;
    if (!userId) {
      res.sendStatus(HttpStatus.Unauthorized);
      return;
    }
    const content = {
      comment: req.body.content,
      userId: userId,
      postId: req.params.id,
    };
    console.log(content);
    const result = await commentsService.createComment(content);
    if (result.status === ResultStatus.Success) {
      const dataForResponse = await commentsQueryRepository.findById(
        result.data!.commentId
      );
      res.status(HttpStatus.Created).send(dataForResponse);
      return;
    }

    res.sendStatus(HttpStatus.BadRequest);
    return;
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}

// {
//     "id": "688ae607e5117e9f793eaa76",
//     "content": {
//         "content": "safdsfdsfdsfdasfd" тут не объект должен возвращаться, нужно решить эту проблему
//     },
//     "commentatorInfo": {
//         "userId": null,
//         "userLogin": "newDan"
//     },
//     "createdAt": "2025-07-31T03:41:59.543Z"
// }
