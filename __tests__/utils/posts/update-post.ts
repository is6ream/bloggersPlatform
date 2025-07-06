import { Express } from "express";
import { PostUpdateInput } from "../../e2e/posts/types/types";
import { PostInputDto } from "../../../src/posts/types/posts-types";
import { getPostDto } from "./get-post-dto";
import { POSTS_PATH } from "../../../src/core/paths";
import request from "supertest";
import { generateBasicAuthToken } from "./generate-admin-auth-token";
import { HttpStatus } from "../../../src/core/http-statuses";

export async function updatePost(
  app: Express,
  postId: string,
  postDto?: PostUpdateInput,
): Promise<void> {
  const defaultPostData: Promise<PostUpdateInput> = getPostDto();

  const testPostData = { ...defaultPostData, ...postDto };

  const updatedPostResponse = await request(app)
    .put(`${POSTS_PATH}/${postId}`)
    .set("Authorization", generateBasicAuthToken())
    .send(testPostData)
    .expect(HttpStatus.NoContent);

  return updatedPostResponse.body;
}
