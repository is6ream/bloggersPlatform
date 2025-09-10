import { BlogInputDto } from "../../../../src/blogs/types/blogs-types";
import { getBlogDto } from "./get-blog-dto";
import { BlogViewModel } from "../../../../src/blogs/types/blogs-types";
import { Express } from "express";
import request from "supertest";
import { BLOGS_PATH } from "../../../../src/core/paths";
import { generateBasicAuthToken } from "../secure/genBasicAuthToken";
import { HttpStatus } from "../../../../src/core/http-statuses";
import { PostInputDto } from "../../../../src/posts/types/posts-types";
import { POSTS_PATH } from "../../../../src/core/paths";
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
