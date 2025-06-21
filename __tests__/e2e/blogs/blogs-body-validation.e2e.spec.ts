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
      "mongodb+srv://admin:admin@firstcluster.atxbolf.mongodb.net/?retryWrites=true&w=majority&appName=FirstCluster",
    );
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  jest.setTimeout(10000);

  it("should not create blog when incorrect body passed; POST /api/blog", async () => {
    const inCorrectTestBlogData: BlogCreateInput = {
      name: "  ",
      description: "dan",
      websiteUrl: "/http://dan.ru",
    };

    await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", generateBasicAuthToken())
      .send(inCorrectTestBlogData)
      .expect(HttpStatus.BadRequest);
  });
});
