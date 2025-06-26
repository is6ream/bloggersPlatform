import express from "express";
import { setupApp } from "../../../src/setup-app";
import { generateBasicAuthToken } from "../../utils/posts/generate-admin-auth-token";
import { runDB } from "../../../src/db/mongo.db";
import { PostInputDto } from "../../../src/posts/types/posts-types";
import { clearDb } from "../../utils/posts/clear-db";
import { stopDb } from "../../../src/db/mongo.db";
import { createBlog } from "../../utils/blogs/create-blog";
import { createPost } from "../../utils/posts/createPost";
import { POSTS_PATH } from "../../../src/core/paths";
import request from "supertest";
import { HttpStatus } from "../../../src/core/http-statuses";
import { getPostById } from "../../utils/posts/get-post-by-id";
import { PostUpdateInput } from "./types/types";
import { updatePost } from "../../utils/posts/update-post";
import { PostCreateInput } from "./types/types";
describe("Post API", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB(
      "mongodb+srv://admin:admin@cluster0.ovmw16i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    );
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it("should create post; POST /api/posts", async () => {
    const blog = createBlog(app);
    const blogId = (await blog).id;
    const postDto: PostInputDto = {
      title: "test1",
      shortDescription: "sh1",
      content: "c1",
      blogId: blogId,
    };
    await createPost(app, postDto);
  });

  it("should return posts list; GET /api/posts", async () => {
    const blog = createBlog(app);
    const blogId = (await blog).id;

    const postDto1: PostCreateInput = {
      title: "t1",
      shortDescription: "sh1",
      content: "c1",
      blogId: blogId,
    };

    const postDto2: PostCreateInput = {
      title: "t2",
      shortDescription: "sh2",
      content: "c2",
      blogId: blogId,
    };
    await Promise.all([createPost(app, postDto1), createPost(app, postDto2)]);
    const response = await request(app).get(POSTS_PATH).expect(HttpStatus.Ok);

    expect(response.body.items).toBeInstanceOf(Array);

    expect(response.body).toHaveProperty("pagesCount");
    expect(response.body).toHaveProperty("page");
    expect(response.body).toHaveProperty("pageSize");
    expect(response.body).toHaveProperty("totalCount");
  });

  it("should return post by id; GET /api/posts/:id", async () => {
    const blog = createBlog(app);
    const blogId = (await blog).id;

    const postDto1: PostCreateInput = {
      title: "t1",
      shortDescription: "sh1",
      content: "c1",
      blogId: blogId,
    };
    const createdPost = await createPost(app, postDto1);
    const createdPostId = createdPost.id;

    const post = await getPostById(app, createdPostId);

    expect(post).toEqual({
      ...createdPost,
    });
  });

  it("should update post:  PUT /api/posts/:id", async () => {
    const blog1 = createBlog(app); //создаем блог, для получения blogId
    const blogId1 = (await blog1).id;

    const postDto1: PostCreateInput = {
      title: "t1",
      shortDescription: "sh1",
      content: "C1",
      blogId: blogId1, //используем тут
    };
    const createdPost = await createPost(app, postDto1); //создаем пост
    const createdPostId = createdPost.id; //получаем доступ к его id для его обновления в дальнейшем

    const postUpdateData: PostUpdateInput = {
      title: "t1",
      shortDescription: "sh1",
      content: "C1",
      blogId: blogId1,
    };

    await updatePost(app, createdPostId, postUpdateData);

    const postResponse = await getPostById(app, createdPostId);
    expect(postResponse.title).toBe(createdPost.title);
    expect(postResponse.shortDescription).toBe(createdPost.shortDescription);
    expect(postResponse.content).toBe(createdPost.content);
    expect(postResponse.blogId).toBe(createdPost.blogId);
  });

  it("should delete post and check after not found; DELETE /api/posts/:id", async () => {
    const blog = createBlog(app);
    const blogId = (await blog).id;

    const postDto1: PostCreateInput = {
      title: "t1",
      shortDescription: "sh1",
      content: "c1",
      blogId: blogId,
    };
    const createdPost = await createPost(app, postDto1);
    const createdPostId = createdPost.id;

    await request(app)
      .delete(`${POSTS_PATH}/${createdPostId}`)
      .set("Authorization", adminToken)
      .expect(HttpStatus.NoContent);

    await request(app)
      .get(`${POSTS_PATH}/${createdPostId}`)
      .expect(HttpStatus.NotFound);
  });
});
