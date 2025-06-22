import { BlogCreateInput } from "./types";
import { setupApp } from "../../../src/setup-app";
import express from "express";
import { generateBasicAuthToken } from "../../utils/posts/generate-admin-auth-token";
import { runDB, stopDb } from "../../../src/db/mongo.db";
import { clearDb } from "../../utils/posts/clear-db";
import { createBlog } from "../../utils/blogs/create-blog";
import { BlogInputDto } from "../../../src/blogs/types/blogs-types";
import request from "supertest";
import { BLOGS_PATH } from "../../../src/core/paths";
import { HttpStatus } from "../../../src/core/http-statuses";
describe("Blog API", () => {
  const app = express();
  setupApp(app);

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

  it("should create blog; POST /api/blogs", async () => {
    const blogDto: BlogInputDto = {
      name: "test1",
      description: "test1",
      websiteUrl: "https://samurai.it-incubator.io/swagger?id=h04",
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    await createBlog(app, blogDto);
  });

  it("should return blogs list; GET /api/blogs", async () => {
    await Promise.all([createBlog(app), createBlog(app)]);

    const response = await request(app)
      .get(BLOGS_PATH)
      .set("Authorization", adminToken)
      .expect(HttpStatus.Ok);

    expect(response.body.items).toBeInstanceOf(Array);

    expect(response.body).toHaveProperty("pagesCount");
    expect(response.body).toHaveProperty("page");
    expect(response.body).toHaveProperty("pageSize");
    expect(response.body).toHaveProperty("totalCount");
  });
});
