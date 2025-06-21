import { HttpStatus } from "../../core/http-statuses";
import { Request, Response } from "express";
import { postsService } from "../application/post.service";

export async function deleteAllPosts(req: Request, res: Response) {
  await postsService.deleteAll();
  res.status(HttpStatus.NoContent).send();
}
