import express, { Express } from "express";
import { db } from "../../../src/db/mongo.db";
import { setupApp } from "../../../src/setup-app";
import { POSTS_PATH } from "../../../src/core/paths";
import request from "supertest";
import { HttpStatus } from "../../../src/core/http-statuses";
import { createPostForBlog } from "../utils/blogs/createPostForBlog";
import { returnPostByBlogId } from "../utils/posts/createPostByBlogId";
import { PostInputDto } from "../../../src/posts/types/posts-types";
import { getTestPostData } from "../utils/posts/getPostDto";
import { BlogViewModel } from "../../../src/blogs/types/blogs-types";
import { createBlog } from "../utils/blogs/create-blog";
import { generateBasicAuthToken } from "../utils/secure/genBasicAuthToken";
import { createUserAndAuth } from "../users/createAndAuthUser";

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
      const post = await returnPostByBlogId(app);
      const res = await request(app)
        .get(`${POSTS_PATH}/${post.id}`)
        .expect(HttpStatus.Ok);

      expect(res.body).toBeDefined();
    });
  });

  describe("Test for command requests on post branch", () =>
    it("should create new post", async () => {
      const blog: BlogViewModel = await createBlog(app);
      const postDto: PostInputDto = getTestPostData(blog.id);

      const res = await request(app)
        .post(POSTS_PATH)
        .set("Authorization", generateBasicAuthToken())
        .send(postDto)
        .expect(HttpStatus.Created);

      expect(res.body).toBeDefined();
    }));

  it("should create new comment", async () => {
    const post = await returnPostByBlogId(app);
    const token = await createUserAndAuth(app);

    const res = await request(app)
      .post(`${POSTS_PATH}/${post.id}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "stringstringstringstring" })
      .expect(HttpStatus.Created);

    expect(res.body).toBeDefined();
  });
});
