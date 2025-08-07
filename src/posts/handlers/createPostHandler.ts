import { Request, Response } from "express";
import { HttpStatus } from "../../core/http-statuses";
import { postQueryRepository } from "../repositories/postQueryRepository";
import { postsService } from "../application/post.service";
import { ResultStatus } from "../../core/result/resultCode";
import { resultCodeToHttpException } from "../../core/result/resultCodeToHttpException";

export async function createPostHandler(req: Request, res: Response) {
  try {
    const result = await postsService.create({
      title: req.body.title,
      shortDescription: req.body.shortDescription,//
      content: req.body.content,
      blogId: req.body.blogId,
    });
    if (result.status !== ResultStatus.Success) {
      res
        .status(resultCodeToHttpException(result.status))
        .send(result.extensions);
      return;
    }
    const newPost = await postQueryRepository.findById(result.data!);
    res.status(HttpStatus.Created).send(newPost.data!);
    return;
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
