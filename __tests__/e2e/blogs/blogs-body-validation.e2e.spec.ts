import { setupApp } from "./../../../src/setup-app";
import request from "supertest";
import express from "express";
import { HttpStatus } from "../../../src/core/types";
import { BlogInputDto } from "../../../src/blogs/types/blogs-types";
import { generateBasicAuthToken } from "../../utils/posts/generate-admin-auth-token";
import { getBlogDto } from "../../utils/blogs/get-blog-dto";
import { clearDb } from "../../utils/posts/clear-db";
import { createBlog } from "../../utils/blogs/create-blog";
import { BLOGS_PATH } from "../../../src/core/paths";
import { getBlogById } from "../../utils/blogs/get-blog-by-id";
import { runDB, stopDb } from "../../../src/db/mongo.db";

describe("Blog API body validation check", () => {
  const app = express();
  setupApp(app);

  const correctTestBlogData: BlogInputDto = getBlogDto();

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB(
      "mongodb+srv://admin:admin@firstcluster.atxbolf.mongodb.net/?retryWrites=true&w=majority&appName=FirstCluster",
    ); //для тестов я должен создать еще один кластер
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it("should not create blog with incorrect body passed", async () => {
    await request(app)
      .post(BLOGS_PATH)
      .send(correctTestBlogData)
      .expect(HttpStatus.Created);

    const invalidDataSet1 = await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", generateBasicAuthToken())
      .send({
        name: "  ",
        description: "   ",
        websiteUrl:
          "https://GsuTxAcRm-p_crkC9ZbOnhEG5Lkn3Ys8GNcPofx2xK7IKDC3wk-d5o6vNC-KaBk6voLhdyJkZHDI8WkUxoU.r_5--BNX",
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(3);

    const invalidDataSet2 = await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", generateBasicAuthToken())
      .send({
        name: "dan",
        description: "  ",
        websiteUrl: "http://slam.com",
      })
      .expect(HttpStatus.BadRequest);
    expect(invalidDataSet2.body.errorMessages).toHaveLength(1);

    const invalidDataSet3 = await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", generateBasicAuthToken())
      .send({
        name: "jam",
        description: "   ",
        websiteUrl: "   ",
      })
      .expect(HttpStatus.BadRequest);
    expect(invalidDataSet3.body.errorMessages).toHaveLength(2);

    const blogListResponse = await request(app)
      .get(BLOGS_PATH)
      .set("Authorization", generateBasicAuthToken());
    expect(blogListResponse.body).toHaveLength(0);
  });
});

//еще два теста нужно прописать
