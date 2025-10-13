import express, { Express } from "express";
import { db } from "../../../src/db/mongo.db";
import { setupApp } from "../../../src/setup-app";
import { createBlog } from "../utils/blogs/create-blog";
import { BlogViewModel } from "../../../src/blogs/types/blogs-types";
import { testSeeder } from "../../integration_test/testSeeder";
import { registerUser } from "../auth/helpers/registerUser";
import { createPost } from "../utils/posts/create-post";
import { AUTH_PATH, POSTS_PATH } from "../../../src/core/paths";
import { HttpStatus } from "../../../src/core/http-statuses";
import request from "supertest";

describe("Testing the comments branch", () => {
  let app: Express;
  beforeAll(async () => {
    await db.runDB(
      "mongodb+srv://admin:admin@cluster0.x2itf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
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
  describe("Tests for commands requests on comments branch", () => {
    const { login, password, email } = testSeeder.createUserDto();
    const registerCredentials = {
      login: login,
      password: password,
      email: email,
    };

    it("should create new comment", async () => {
      const blog: BlogViewModel = await createBlog(app); //создаем блог
      const post = await createPost(app, {
        //создаем пост для блога
        title: "title",
        shortDescription: "sh1",
        content: "content",
        blogId: blog.id,
      });
      await registerUser(app, registerCredentials);
      const loginCredentials = { loginOrEmail: login, password: password };
      const resLogin = await request(app)
        .post(AUTH_PATH + "/login")
        .send(loginCredentials)
        .expect(HttpStatus.Ok);
      expect(resLogin.body.accessToken).toBeDefined();
      expect(resLogin.headers["set cookie"]);

      const accessToken = await resLogin.body.accessToken;

      const createCommentRes = await request(app)
        .post(`${POSTS_PATH}/${post.id}/comments`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ content: "stringstringstrinstring" })
        .expect(HttpStatus.Created);

      expect(createCommentRes.body).toBeDefined();
      console.log(createCommentRes.body);
    });
  });
});
