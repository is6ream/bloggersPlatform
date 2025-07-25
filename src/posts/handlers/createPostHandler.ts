import { Request, Response } from "express";
import { HttpStatus } from "../../core/http-statuses";
import { postQueryRepository } from "../repositories/postQueryRepository";
import { postsService } from "../application/post.service";
import { ResultStatus } from "../../core/result/resultCode";
import { resultCodeToHttpException } from "../../core/result/resultCodeToHttpException";

export async function createPostHandler(req: Request, res: Response) {
  const result = await postsService.create({
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    blogId: req.body.blogId,
  });
  if (result.status !== ResultStatus.Success) {
    return res
      .status(resultCodeToHttpException(result.status))
      .send(result.extensions);
  }
  const resultId = result.data;  //намудрил конечно, но попробуем
  const postForResponse = await postQueryRepository.findById(resultId!);
  res.status(HttpStatus.Created).send(postForResponse);
}
