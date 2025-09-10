import {
  PostInputDto,
  PostViewModel,
} from "../../../../src/posts/types/posts-types";
import { Express } from "express";


export async function createPost(
  app: Express,
  postDto: PostInputDto
): Promise<PostViewModel> {
const defaultPostData: PostInputDto = 

}


