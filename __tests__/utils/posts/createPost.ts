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
import { PostCreateInput } from "../../e2e/posts/types/types";

export async function createPost(
  app: Express,
  postDto?: PostCreateInput
): Promise<PostViewModel> {
  const defaultPostData: Promise<PostInputDto> = getPostDto();
  const testPostData = { ...defaultPostData, ...postDto };
  console.log(testPostData);

  const createdPostResponse = await request(app)
    .post(POSTS_PATH)
    .set("Authorization", generateBasicAuthToken())
    .send(testPostData)
    .expect(HttpStatus.Created);

  return createdPostResponse.body;
}
