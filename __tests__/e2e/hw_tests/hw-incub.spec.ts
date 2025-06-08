import express from "express";
import { setupApp } from "../../../src/setup-app";
import { generateBasicAuthToken } from "../../utils/posts/generate-admin-auth-token";
import { runDB, stopDb } from "../../../src/db/mongo.db";
import { clearDb } from "../../utils/posts/clear-db";
import { after } from "node:test";
import { BLOGS_PATH } from "../../../src/core/paths";
import request from "supertest";
import { HttpStatus } from "../../../src/core/types";
describe("blog API repository check", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB(
      "mongodb+srv://admin:admin@cluster0.nm5nplv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    );
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it("should create blog with correct body passes", async () => {
    await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", adminToken)
      .send({
        name: "dan",
        description: "dan",
        websiteUrl: "/http://jam.com",
      })
      .expect(HttpStatus.Created);
  });
});
