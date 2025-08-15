import { Request, Response } from "express";
import { postsService } from "../../../posts/application/post.service";
import { HttpStatus } from "../../../core/http-statuses";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { postQueryRepository } from "../../../posts/repositories/postQueryRepository";

export async function createPostByBlogId(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id: id } = req.params;
    const result = await postsService.createPostByBlogId(id, req.body);
    if (result.status !== ResultStatus.Success) {
      res
        .status(resultCodeToHttpException(result.status))
        .send(result.extensions);
      return;
    }
    const resultId = result.data;
    const post = await postQueryRepository.findById(resultId!);
    res.status(HttpStatus.Created).send(post.data);
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
