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
import { getBlogById } from "../../utils/blogs/get-blog-by-id";
import { updateBlog } from "../../utils/blogs/update-blog";
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

  it("should return blog by id; GET /api/blogs/:id", async () => {
    const createdBlog = await createBlog(app); //слздаем блог
    const createdBlogId = createdBlog.id;

    const blog = await getBlogById(app, createdBlogId); //запрашиваем его по id

    expect(blog).toEqual({
      //сравниваем их
      ...createdBlog,
    });
  });

  it("should update blog; PUT /api/blogs/:id", async () => {
    const createdBlog = await createBlog(app);
    const createdBlogId = createdBlog.id;

    const blogUpdateData: BlogUpdateInput = {
      name: "testUpdate1",
      description: "testUpdate2",
      websiteUrl: "https://translate.google.com/?hl=ru",
    };

    await updateBlog(app, createdBlogId, blogUpdateData);

    const blogResponse = await getBlogById(app, createdBlogId);
    expect(blogResponse.id).toBe(createdBlogId);
    expect(blogResponse.name).toBe(blogUpdateData.name);
    expect(blogResponse.description).toBe(blogUpdateData.description);
    expect(blogResponse.websiteUrl).toBe(blogUpdateData.websiteUrl);
  });

  it("should delete blog and check after not found; DELETE /api/blogs/:id", async () => {
    const createdBlog = await createBlog(app);
    const createdBlogId = createdBlog.id;

    await request(app)
      .delete(`${BLOGS_PATH}/${createdBlogId}`)
      .set("Authorization", adminToken)
      .expect(HttpStatus.NoContent);

    await request(app)
      .get(`${BLOGS_PATH}/${createdBlogId}`)
      .expect(HttpStatus.NotFound);
  });
});
