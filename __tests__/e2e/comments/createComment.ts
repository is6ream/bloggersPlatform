import request from "supertest";
import { Express } from "express";
import { AUTH_PATH, POSTS_PATH, USERS_PATH } from "../../../src/core/paths";
import { HttpStatus } from "../../../src/core/http-statuses";
import { createBlog } from "../utils/blogs/create-blog";
import { createPost } from "../utils/posts/create-post";
import { getUserCredentials } from "../users/getUserCredentials";
import { generateBasicAuthToken } from "../utils/secure/genBasicAuthToken";

//создаем блог, создаем пост, создаем юзера, авторизовываемся, создаем коммент

export const createComment = async (app: Express) => {
  const blog = await createBlog(app);
  const blogId = blog.id;
  const post = await createPost(app, {
    title: "new Post",
    shortDescription: "sh1",
    content: "12345",
    blogId: blogId,
  });
  const postId = post.id;
  const credentials = {
    login: "ecd_Xpt2Ei",
    password: "string",
    email: "example@example.com",
  };

  const createUser = await request(app)
    .post(USERS_PATH)
    .send(credentials)
    .set("Authorization", generateBasicAuthToken())
    .expect(HttpStatus.Created);

  const authRes = await request(app)
    .post(`${AUTH_PATH}/login`)
    .send({
      loginOrEmail: credentials.login,
      password: credentials.password,
    })
    .expect(HttpStatus.Ok);
  const comment = { content: "stringstringstringstring" };
  const accessToken = authRes.body.access_token;

  const createCommentRes = await request(app)
    .post(`${POSTS_PATH}/${postId}/comments`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send(comment)
    .expect(HttpStatus.Created); //тут получил Unauthorized
};
//
// export const createComment = async (app: Express, postId?: string) => {
//   let id: string = randomUUID();
//   const token = await createUserAndAuth(app, {
//     login: "newLog",
//     email: "testEmail@mail.com",
//     password: "123456",
//   });
//
//   if (postId) {
//     id = postId;
//     const createCommentRes = await request(app)
//       .post(`${POSTS_PATH}/${id}}/comments`)
//       .set("Authorization", `Bearer ${token}`)
//       .send({ content: "stringstringstringstring" })
//       .expect(HttpStatus.Created);
//
//     return createCommentRes.body;
//   } else {
//     const post = await returnPostByBlogId(app);
//
//     const createCommentRes = await request(app)
//       .post(`${POSTS_PATH}/${post.id}/comments`)
//       .set("Authorization", `Bearer ${token}`)
//       .send({ content: "stringstringstringstring" })
//       .expect(HttpStatus.Created);
//
//     return createCommentRes.body;
//   }
// };
