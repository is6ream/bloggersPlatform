import request from "supertest";
import { Express } from "express";
import {
  AUTH_PATH,
  BLOGS_PATH,
  POSTS_PATH,
  USERS_PATH,
} from "../../../src/core/paths";
import { HttpStatus } from "../../../src/core/http-statuses";
import { createBlog } from "../utils/blogs/create-blog";
import { createPost } from "../utils/posts/create-post";
import { getUserCredentials } from "../users/getUserCredentials";
import { generateBasicAuthToken } from "../utils/secure/genBasicAuthToken";
import { PostInputDto } from "../../../src/posts/types/posts-types";

//создаем блог, создаем пост, создаем юзера, авторизовываемся, создаем коммент

export const createComment = async (app: Express) => {
  const blog = await createBlog(app); //создаем блог, берем айди для создания поста
  const blogId = blog.id;
  const blogRes = await request(app).get(BLOGS_PATH); //хотел проверить, есть ли такой блог при создании поста по id
  console.log(blogId, "АЙДИ блога чек");
  const post: PostInputDto = {
    title: "title",
    shortDescription: "title",
    content: "content",
    blogId: blogId,
  };
  const createPostRes = await request(app) //создаем пост для блога
    .post(POSTS_PATH)
    .set("Authorization", generateBasicAuthToken())
    .send(post)
    .expect(HttpStatus.Created);

  const postId = createPostRes.body;
  console.log(postId, "post body check");
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
  const comment = { content: "danio224422233221321sadsads3" };
  const accessToken = authRes.body.accessToken;
  const createCommentRes = await request(app)
    .post(`${POSTS_PATH}/${postId}/comments`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send(comment.content)
    .expect(HttpStatus.Created); //тут получил Bad request

  console.log(createCommentRes.body, "errors check");
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
