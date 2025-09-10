import express, { Express } from "express";
import { setupApp } from "../../../src/setup-app";
import { db } from "../../../src/db/mongo.db";
import request from "supertest";
import { BLOGS_PATH } from "../../../src/core/paths";
import { createBlog, createPostForBlog } from "../utils/blogs/create-blog";
import { HttpStatus } from "../../../src/core/http-statuses";
describe("Testing the blog branch", () => {
  let app: Express;
  beforeAll(async () => {
    await db.runDB(
      "mongodb+srv://admin:admin@cluster0.x2itf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    await db.drop();
    const expressApp = express();
    app = setupApp(expressApp);
  });

  afterAll(async () => {
    await db.drop();
    await db.stop();
  });
  describe("Tests for query requests", () => {
    it("should return blogs with paging", async () => {
      const res = await request(app)
        .get(BLOGS_PATH + "?sortBy=createdAt&pageNumber=1&pageSize=10")
        .expect(200);

      expect(res.body).toBeDefined;
    });

    it("should return all posts for specified blog", async () => {
      const blog = await createPostForBlog(app);
      const res = await request(app)
        .get(BLOGS_PATH + `/${blog.id}/posts`)
        .expect(HttpStatus.Ok);

      expect(res.body).toBeDefined();
    });

    it("should retun blog by id", async () => {
      const blog = await createBlog(app);
      const res = await request(app)
        .get(BLOGS_PATH + `/${blog.id}`)
        .expect(HttpStatus.Ok);

      expect(res.body).toBeDefined();
    });
  });
});
