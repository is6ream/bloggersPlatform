import { BlogUpdateInput } from "../../../src/blogs/routes/input/blog-update-input";
import express, { Express } from "express";
import { setupApp } from "../../../src/setup-app";
import request from "supertest";
import { BLOGS_PATH } from "../../../src/core/paths";
import { createPostForBlog } from "../utils/blogs/createPostForBlog";
import { HttpStatus } from "../../../src/core/http-statuses";
import { getBlogDto } from "../utils/blogs/get-blog-dto";
import { generateBasicAuthToken } from "../utils/secure/genBasicAuthToken";
import { PostByIdInputDto } from "../../../src/posts/types/posts-types";
import { createBlog } from "../utils/blogs/create-blog";
import { db } from "../../../src/db/runDb";

describe("Testing the blog branch", () => {
  let app: Express;
  beforeAll(async () => {
    await db.runDb();
    const expressApp = express();
    app = setupApp(expressApp);
  });
  beforeEach(async () => {
    await db.runDb();
  });

  afterAll(async () => {
    await db.dropDb();
    await db.stopDb();
  });
  describe("Tests for query requests on blogs branch", () => {
    it("should return blogs with paging", async () => {
      await createBlog(app);
      const res = await request(app)
        .get(BLOGS_PATH + "?sortBy=createdAt&pageNumber=1&pageSize=10")
        .expect(200);

      expect(res.body).toBeDefined();
    });

    it("should return all posts for specified blog", async () => {
      const blog = await createPostForBlog(app);
      const res = await request(app)
        .get(BLOGS_PATH + `/${blog.id}/posts`)
        .expect(HttpStatus.Ok);

      expect(res.body).toBeDefined();
    });

    it("should return blog by id", async () => {
      const blog = await createBlog(app);
      const res = await request(app)
        .get(BLOGS_PATH + `/${blog.id}`)
        .expect(HttpStatus.Ok);

      expect(res.body).toBeDefined();
    });
  });
  describe("tests for command blogs requests", () => {
    it("should create new blog", async () => {
      const blogDto = getBlogDto();
      const res = await request(app)
        .post(BLOGS_PATH)
        .set("Authorization", generateBasicAuthToken())
        .send(blogDto)
        .expect(HttpStatus.Created);

      expect(res.body).toBeDefined();
    });

    it("should create post for specified blog", async () => {
      const blog = await createBlog(app);
      const postDto: PostByIdInputDto = {
        title: "post for blog",
        shortDescription: "test",
        content: "c1",
      };

      const res = await request(app)
        .post(`${BLOGS_PATH}/${blog.id}/posts`)
        .set("Authorization", generateBasicAuthToken())
        .send(postDto)
        .expect(HttpStatus.Created);

      expect(res.body).toBeDefined;
    });

    it("should update blog by id", async () => {
      const blog = await createBlog(app);
      const blogUpdateDto: BlogUpdateInput = {
        name: "new Name",
        description: "new Description",
        websiteUrl: "https://www.google.com/",
      };

      await request(app)
        .put(`${BLOGS_PATH}/${blog.id}`)
        .set("Authorization", generateBasicAuthToken())
        .send(blogUpdateDto)
        .expect(HttpStatus.NoContent);
    });

    it("should delete blog by id", async () => {
      const blog = await createBlog(app);
      await request(app)
        .delete(`${BLOGS_PATH}/${blog.id}`)
        .set("Authorization", generateBasicAuthToken())
        .expect(HttpStatus.NoContent);
    });
  });
});
