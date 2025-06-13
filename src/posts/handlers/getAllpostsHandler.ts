import { Request, Response } from "express";
import { HttpStatus } from "../../core/http-statuses";
import { postRepository } from "../repositories/postRepository";
import { setDefaultPaginationIfNotExist } from "../../core/helpers/set-default-sort-and-pagination";
import { postsService } from "../application/post.service";

export async function getAllPostsHandler(req: Request, res: Response) {
  try {
    const queryInput = setDefaultPaginationIfNotExist(req.query);

    const { items, totalCount } = await postsService.findMany(queryInput)

    const postsListOutput = 
  } d
  
  const posts = await postRepository.findAll();
  res.status(HttpStatus.Ok).json(posts);
}
