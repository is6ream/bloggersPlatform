import express, { Express } from "express";
import { db } from "../../../src/db/mongo.db";
import { setupApp } from "../../../src/setup-app";
import { createPost } from "../utils/posts/create-post";
import { POSTS_PATH } from "../../../src/core/paths";
import request from "supertest";
import { HttpStatus } from "../../../src/core/http-statuses";
import { createPostByBlogId } from "../../../src/blogs/routes/handlers/createPostByBlogIdHandler";
import { createPostForBlog } from "../utils/blogs/createPostForBlog";
describe("Testing post branch", () => {
  let app: Express;
  beforeAll(async () => {
    await db.runDB(
      "mongodb+srv://admin:admin@cluster0.x2itf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    const expressApp = express();
    app = setupApp(expressApp);
  });
  beforeEach(async () => {
    await db.drop();
  });

  afterAll(async () => {
    await db.drop();
    await db.stop();
  });

  describe("Tests for query requests on posts branch", () => {
    it("should return posts with paging", async () => {
      await createPostForBlog(app);
      const res = await request(app)
        .get(`${POSTS_PATH}?sortBy=createdAt&pageNumber=1&pageSize=10`)
        .expect(HttpStatus.Ok);

      expect(res.body).toBeDefined();
    });

    it("should return post by id", async () => {
      const post = await createPostForBlog(app);
      const res = await request(app)
        .get(`${POSTS_PATH}/${post.id}`)
        .expect(HttpStatus.Ok);

      expect(res.body).toBeDefined();
    });
  });
});
