import {
  PostInputDto,
  PostViewModel,
} from "../../../../src/posts/types/posts-types";
import { Express } from "express";
import { getPostDto } from "./getPostDto";
import request from "supertest";
import { POSTS_PATH } from "../../../../src/core/paths";
import { generateBasicAuthToken } from "../secure/genBasicAuthToken";
import { HttpStatus } from "../../../../src/core/http-statuses";
export async function createPost(
  app: Express,
  postDto: PostInputDto,
): Promise<PostViewModel> {
  const createdPostResponse = await request(app)
    .post(POSTS_PATH)
    .set("Authorization", generateBasicAuthToken())
    .send(postDto)
    .expect(HttpStatus.Created);

  return createdPostResponse.body;
}
