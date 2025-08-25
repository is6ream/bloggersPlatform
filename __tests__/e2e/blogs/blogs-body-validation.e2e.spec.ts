import { setupApp } from "./../../../src/setup-app";
import express from "express";
import { BlogAttributes } from "./types";
import { getBlogDto } from "../../utils/blogs/get-blog-dto";
import { generateBasicAuthToken } from "../../utils/posts/generate-admin-auth-token";
import { runDB } from "../../../src/db/mongo.db";
import { clearDb } from "../../utils/posts/clear-db";
import { stopDb } from "../../../src/db/mongo.db";
import request from "supertest";
import { BLOGS_PATH } from "../../../src/core/paths";
import { BlogCreateInput } from "./types";
import { HttpStatus } from "../../../src/core/http-statuses";
import { createBlog } from "../../utils/blogs/create-blog";
import { BlogUpdateInput } from "./types";
import { blogQueryRepository } from "../../../src/blogs/repositories/blogs.query.repository";
describe("Blog API body validation check", () => {
  const app = express();
  setupApp(app);

  const correctTestBlogAttributes: BlogAttributes = getBlogDto();
  beforeAll(async () => {
    await runDB(
      "mongodb+srv://admin:admin@cluster0.nm5nplv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    );
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it("should not create blog when incorrect body passed; POST /api/blog", async () => {
    const correctTestBlogData: BlogCreateInput = {
      name: "dan",
      description: "dan",
      websiteUrl: "/htpp://sla.com",
    };

    const incorrectTestBlogData: BlogCreateInput = {
      name: " ",
      description: "dan22",
      websiteUrl: "/http://dan22.com",
    };

    await request(app)
      .post(BLOGS_PATH)
      .send(correctTestBlogData)
      .expect(HttpStatus.Unauthorized);

    const invalidDataSet1 = await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", generateBasicAuthToken())
      .send(incorrectTestBlogData)
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorsMessages).not.toBeUndefined();

    //проверка что блог не создался
    const blogListResponse = await request(app).get(BLOGS_PATH);
    expect(blogListResponse.body.items).toHaveLength(0);
  });

  it("should not update blog when incorrect data passed; PUT api/blogs/:id", async () => {
    const createdBlog = await createBlog(app, correctTestBlogAttributes);
    const createdBlogId = createdBlog.id;
    const incorrectTestBlogData1: BlogUpdateInput = {
      name: " ",
      description: " ",
      websiteUrl: " ",
    };

    const invalidDataSet1 = await request(app)
      .put(`${BLOGS_PATH}/${createdBlogId}`)
      .set("Authorization", generateBasicAuthToken())
      .send(incorrectTestBlogData1)
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorsMessages).toHaveLength(3);

    const incorrectTestBlogData2: BlogUpdateInput = {
      name: "dan22",
      description: "da22",
      websiteUrl: " ",
    };

    const invalidDataSet2 = await request(app)
      .put(`${BLOGS_PATH}/${createdBlogId}`)
      .set("Authorization", generateBasicAuthToken())
      .send(incorrectTestBlogData2)
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorsMessages).toHaveLength(1);

    const blogResponse = await blogQueryRepository.findById(createdBlogId);

    expect(blogResponse).toEqual({
      ...createdBlog, //сравниваем с созданным ранее блогом, который прошел обновление
    });
  });
});
