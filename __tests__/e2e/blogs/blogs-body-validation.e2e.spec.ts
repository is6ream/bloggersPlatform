import { setupApp } from "./../../../src/setup-app";
import express from "express";
import { BlogAttributes } from "./types";
import { getBlogDto } from "../../utils/blogs/get-blog-dto";
import { generateBasicAuthToken } from "../../utils/posts/generate-admin-auth-token";
import { runDB } from "../../../src/db/mongo.db";
import { clearDb } from "../../utils/posts/clear-db";
import { stopDb } from "../../../src/db/mongo.db";
import { ResourceType } from "../../../src/core/types/resource-type";
import request from "supertest";
import { BLOGS_PATH } from "../../../src/core/paths";
import { BlogCreateInput } from "./types";
import { HttpStatus } from "../../../src/core/http-statuses";

describe("Blog API body validation check", () => {
  const app = express();
  setupApp(app);

  const correctTestBlogAttributes: BlogAttributes = getBlogDto();

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB(
      "mongodb+srv://admin:admin@firstcluster.atxbolf.mongodb.net/?retryWrites=true&w=majority&appName=FirstCluster"
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
    expect(blogListResponse.body).toHaveLength(0);
  });
});
