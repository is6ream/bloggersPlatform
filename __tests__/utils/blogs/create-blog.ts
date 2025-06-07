import { BLOGS_PATH } from "./../../../src/core/paths";
import { HttpStatus } from "./../../../src/core/types";
import { BlogInputDto } from "./../../../src/blogs/types/blogs-types";
import request from "supertest";
import { Express } from "express";
import { generateBasicAuthToken } from "../posts/generate-admin-auth-token";
import { getBlogDto } from "./get-blog-dto";
import { BlogViewModel } from "./../../../src/blogs/types/blogs-types";

export async function createBlog(
  app: Express,
  blogDto?: BlogInputDto,
): Promise<BlogViewModel> {
  const defaultBlogData: BlogInputDto = getBlogDto();

  const testBlogData = { ...defaultBlogData, ...blogDto };

  const createdBlogResponse = await request(app)
    .post(BLOGS_PATH)
    .set("Authorization", generateBasicAuthToken())
    .send(testBlogData)
    .expect(HttpStatus.Created);

  return createdBlogResponse.body;
}
