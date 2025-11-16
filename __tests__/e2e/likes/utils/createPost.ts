import { BlogInputDto } from "../../../../src/blogs/types/blogs-types";
import { getBlogDto } from "../../utils/blogs/get-blog-dto";
import request from "supertest";
import { BLOGS_PATH, POSTS_PATH } from "../../../../src/core/paths";
import { generateBasicAuthToken } from "../../utils/secure/genBasicAuthToken";
import { HttpStatus } from "../../../../src/core/http-statuses";
import { PostInputDto } from "../../../../src/posts/types/posts-types";
import { getTestPostData } from "../../utils/posts/getPostDto";
import { Express } from "express";

export async function createPost(app: Express): Promise<void> {
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

  await request(app)
    .post(POSTS_PATH)
    .set("Authorization", generateBasicAuthToken())
    .send(testPostData)
    .expect(HttpStatus.Created);
  return;
}
