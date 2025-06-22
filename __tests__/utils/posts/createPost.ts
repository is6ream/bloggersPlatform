import { body } from "express-validator";
import { Express } from "express";
import {
  PostInputDto,
  PostViewModel,
} from "../../../src/posts/types/posts-types";
import { getPostDto } from "./get-post-dto";
import { POSTS_PATH } from "../../../src/core/paths";
import { generateBasicAuthToken } from "./generate-admin-auth-token";
import { HttpStatus } from "../../../src/core/http-statuses";
import request from "supertest";

export async function createPost(
  app: Express,
  postDto?: PostInputDto,
): Promise<PostViewModel> {
  const defaultPostData: PostInputDto = getPostDto();
  const testBlogData = { ...defaultPostData, ...postDto };

  const createdPostResponse = await request(app)
    .post(POSTS_PATH)
    .set("Authorization", generateBasicAuthToken())
    .send(testBlogData)
    .expect(HttpStatus.Created);

  return createdPostResponse.body;
}
