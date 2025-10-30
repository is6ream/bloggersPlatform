import { BlogViewModel } from "../../../src/blogs/types/blogs-types";
import { createBlog } from "../utils/blogs/create-blog";
import { createPost } from "../utils/posts/create-post";
import { registerUser } from "../auth/helpers/registerUser";
import request from "supertest";
import { AUTH_PATH, POSTS_PATH } from "../../../src/core/paths";
import { HttpStatus } from "../../../src/core/http-statuses";
import { testSeeder } from "../../integration_test/testSeeder";
import { Express } from "express";

const { login, password, email } = testSeeder.createUserDto();
const registerCredentials = {
  login: login,
  password: password,
  email: email,
};

export async function createComment(app: Express) {
  const blog: BlogViewModel = await createBlog(app); //создаем блог
  const post = await createPost(app, {
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

  const comment: string = createCommentRes.body.content;
  const commentId: string = createCommentRes.body.id;
  return {
    blogId: blog.id,
    postId: post.id,
    accessToken: accessToken,
    comment: comment,
    commentId: commentId,
  };
}
