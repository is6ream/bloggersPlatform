import { setupApp } from "./../../../src/setup-app";
import express from "express";
import { PostAttributes } from "./types/types";
import { getPostDto } from "../../utils/posts/get-post-dto";
import { generateBasicAuthToken } from "../../utils/posts/generate-admin-auth-token";
import { runDB, stopDb } from "../../../src/db/mongo.db";
import { clearDb } from "../../utils/posts/clear-db";
import { PostCreateInput } from "./types/types";
import { POSTS_PATH } from "../../../src/core/paths";
import { HttpStatus } from "../../../src/core/http-statuses";
import request from "supertest";
import { exec } from "child_process";
describe("Blog API body validation check", () => {
  const app = express();
  setupApp(app);

  const correctTestPostAttributes: PostAttributes = getPostDto();
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
      .set("Authorization", generateBasicAuthToken())
      .send(incorrectTestPostData)
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorsMessages).not.toBeUndefined();

    const postListResponse = await request(app).get(POSTS_PATH);
    expect(postListResponse.body.items).toHaveLength(0);
  });

  it("should not update post when incorrect data passed; PUT /api/post/:id", async () => {
    const createdPost = await createPost;
  });
});
