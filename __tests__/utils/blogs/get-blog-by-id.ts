import request from "supertest";
import { Express } from "express";
import { HttpStatus } from "../../../src/core/types";
import { BLOGS_PATH } from "../../../src/core/paths";
import { generateBasicAuthToken } from "../posts/generate-admin-auth-token";
import { BlogViewModel } from "../../../src/blogs/types/blogs-types";

export async function getBlogById(
  app: Express,
  blogId: string,
): Promise<BlogViewModel> {
  const blogResponse = await request(app)
    .get(`${BLOGS_PATH}/${blogId}`)
    .set("Authorization", generateBasicAuthToken())
    .expect(HttpStatus.Ok);

  return blogResponse.body;
}
