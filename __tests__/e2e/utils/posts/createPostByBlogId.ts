import { BlogInputDto } from "../../../../src/blogs/types/blogs-types";
import { Express } from "express";
import request from "supertest";
import { BLOGS_PATH } from "../../../../src/core/paths";
import { generateBasicAuthToken } from "../secure/genBasicAuthToken";
import { HttpStatus } from "../../../../src/core/http-statuses";
import {
  PostInputDto,
  PostViewModel,
} from "../../../../src/posts/types/posts-types";
import { POSTS_PATH } from "../../../../src/core/paths";
import { getBlogDto } from "../blogs/get-blog-dto";
import { getTestPostData } from "./getPostDto";

export async function returnPostByBlogId(app: Express): Promise<PostViewModel> {
  const defaultBlogData: BlogInputDto = getBlogDto();

  const testBlogData = { ...defaultBlogData };
  const createdBlogResponse = await request(app)
    .post(BLOGS_PATH)
    .set("Authorization", generateBasicAuthToken())
    .send(testBlogData)
    .expect(HttpStatus.Created);

  const testPostData: PostInputDto = getTestPostData(
    createdBlogResponse.body.id,
  );

  const createPostResponse = await request(app)
    .post(POSTS_PATH)
    .set("Authorization", generateBasicAuthToken())
    .send(testPostData)
    .expect(HttpStatus.Created);

  return createPostResponse.body;
}
