import { BLOGS_PATH, POSTS_PATH } from "../../../../src/core/paths";
import { BlogInputDto } from "../../../../src/blogs/types/blogs-types";
import request from "supertest";
import { Express } from "express";
import { generateBasicAuthToken } from "../secure/genBasicAuthToken";
import { getBlogDto } from "./get-blog-dto";
import { BlogViewModel } from "../../../../src/blogs/types/blogs-types";
import { HttpStatus } from "../../../../src/core/http-statuses";
import { PostInputDto } from "../../../../src/posts/types/posts-types";

export async function createBlog(
  app: Express,
  blogDto?: BlogInputDto
): Promise<BlogViewModel> {
  const defaultBlogData: BlogInputDto = getBlogDto();

  const testBlogData = { ...defaultBlogData, ...blogDto };
  const token = generateBasicAuthToken();
  console.log(token);
  const createdBlogResponse = await request(app)
    .post(BLOGS_PATH)
    .set("Authorization", token)
    .send(testBlogData)
    .expect(HttpStatus.Created);

  return createdBlogResponse.body;
}

export async function createPostForBlog(app: Express): Promise<BlogViewModel> {
  const defaultBlogData: BlogInputDto = getBlogDto();

  const testBlogData = { ...defaultBlogData };
  const createdBlogResponse = await request(app)
    .post(BLOGS_PATH)
    .set("Authorization", generateBasicAuthToken())
    .send(testBlogData)
    .expect(HttpStatus.Created);

  const testPostData: PostInputDto = {
    title: "string",
    shortDescription: "string",
    content: "string",
    blogId: createdBlogResponse.body.id,
  };

  await request(app)
    .post(POSTS_PATH)
    .set("Authorization", generateBasicAuthToken())
    .send(testPostData)
    .expect(HttpStatus.Created);

  return createdBlogResponse.body;
}
