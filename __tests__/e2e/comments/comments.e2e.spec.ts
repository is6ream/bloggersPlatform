import express from "express";
import { setupApp } from "../../../src/setup-app";
import { generateBasicAuthToken } from "../../utils/posts/generate-admin-auth-token";
import { runDB, stopDb } from "../../../src/db/mongo.db";
import { clearDb } from "../../utils/posts/clear-db";
import { UserInputModel } from "../../../src/users/types/user-types";
import request from "supertest";
import { COMMENTS_PATH } from "../../../src/core/paths";
import { HttpStatus } from "../../../src/core/http-statuses";
describe("Body API", () => {
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

  it("should create user,then auth user, then create blog, then create post, then create comment", async () => {
    const userDto: UserInputModel = {
      login: "slam",
      email: "danmeon@mail.ru",
      password: "emememdems",
    };

    const res = await request(app)
      .post(COMMENTS_PATH)
      .set("Authorization", generateBasicAuthToken())
      .send(userDto)
      .expect(HttpStatus.Created);

    const authUserData = {
      loginOrEmail: "slam",
      password: "emememdems",
    };
    const authUser = await request(app).post(authUserData);
  });
});
