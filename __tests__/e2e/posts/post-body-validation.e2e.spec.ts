import { setupApp } from "./../../../src/setup-app";
import express from "express";
import { PostUpdateInput } from "./types/types";
import { getPostDto } from "../../utils/posts/get-post-dto";
import { generateBasicAuthToken } from "../../utils/posts/generate-admin-auth-token";
import { runDB, stopDb } from "../../../src/db/mongo.db";
import { clearDb } from "../../utils/posts/clear-db";
import { PostCreateInput } from "./types/types";
import { BLOGS_PATH, POSTS_PATH } from "../../../src/core/paths";
import { HttpStatus } from "../../../src/core/http-statuses";
import request from "supertest";
import { createPost } from "../../utils/posts/createPost";
import { createBlog } from "../../utils/blogs/create-blog";

describe("Post API body validation check", () => {
  const app = express();
  setupApp(app);

  const correctTestPostAttributes: Promise<PostCreateInput> = getPostDto();
  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB(
      "mongodb+srv://admin:admin@cluster0.nm5nplv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it("should create post when correct body passed; POST api/post", async () => {
    await request(app)
      .post(POSTS_PATH)
      .set("Authorization", generateBasicAuthToken())
      .send(correctTestPostAttributes)
      .expect(HttpStatus.Created);
  });

  it("should not create post when incorrect body passed; POST /api/post", async () => {
    const correctTestPostData: PostCreateInput = {
      title: "dan",
      shortDescription: "dan",
      content: "dan",
      blogId: "6857b81064ad31565ab05de0",
    };

    const incorrectTestPostData: PostCreateInput = {
      title: " ",
      shortDescription: " ",
      content: "dan",
      blogId: "6857b81064ad31565ab05de0",
    };

    await request(app)
      .post(POSTS_PATH)
      .send(correctTestPostData)
      .expect(HttpStatus.Unauthorized);

    const invalidDataSet1 = await request(app)
      .post(POSTS_PATH)
      .set("Authorization", adminToken)
      .send(incorrectTestPostData)
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorsMessages).not.toBeUndefined();

    const postListResponse = await request(app).get(POSTS_PATH);
    expect(postListResponse.body.items).toHaveLength(0);
  });

  it("should not update post when incorrect data passed; PUT /api/post/:id", async () => {
    const blog = createBlog(app);
    const blogId = (await blog).id;

    const newPost: PostCreateInput = {
      title: "title",
      shortDescription: "sh1",
      content: "c1",
      blogId: blogId,
    };

    const createdPost = await createPost(app, newPost);
    const createdPostId = createdPost.id;

    const incorrectTestPostData1: PostUpdateInput = {
      title: "dan",
      shortDescription: " ",
      content: " ",
      blogId: " ",
    };

    const invalidDataSet1 = await request(app)
      .put(`${BLOGS_PATH}/${createdPostId}`)
      .set("Authorization", adminToken)
      .send(incorrectTestPostData1)
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorsMessages).toHaveLength(3);
  });
});
