import { Express } from "express";
import { PostViewModel } from "../../../src/posts/types/posts-types";
import request from "supertest";
import { POSTS_PATH } from "../../../src/core/paths";
import { generateBasicAuthToken } from "./generate-admin-auth-token";
import { HttpStatus } from "../../../src/core/http-statuses";

export async function getPostById(
  app: Express,
  postId: string,
): Promise<PostViewModel> {
  const postResponse = await request(app)
    .get(`${POSTS_PATH}/${postId}`)
    .set("Authorization", generateBasicAuthToken())
    .expect(HttpStatus.Ok);
  return postResponse.body;
}
