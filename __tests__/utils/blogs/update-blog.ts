import request from "supertest";
import { Express } from "express";
import { BlogInputDto } from "../../../src/blogs/types/blogs-types";
import { getBlogDto } from "./get-blog-dto";
import { BLOGS_PATH } from "../../../src/core/paths";
import { generateBasicAuthToken } from "../posts/generate-admin-auth-token";
import { BlogUpdateInput } from "../../e2e/blogs/types";
import { HttpStatus } from "../../../src/core/http-statuses";
export async function updateBlog(
  app: Express,
  blogId: string,
  blogDto?: BlogUpdateInput,
): Promise<void> {
  const defaultBlogData: BlogInputDto = getBlogDto();

  const testBlogData = { ...defaultBlogData, ...blogDto };

  const updatedBlogResponse = await request(app)
    .put(`${BLOGS_PATH}/${blogId}`)
    .set("Authorization", generateBasicAuthToken())
    .send(testBlogData)
    .expect(HttpStatus.NoContent);

  return updatedBlogResponse.body;
}
