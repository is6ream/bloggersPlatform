// import express from "express";
// import { setupApp } from "../../../src/setup-app";
// import { generateBasicAuthToken } from "../../utils/posts/generate-admin-auth-token";
// import { runDB, stopDb } from "../../../src/db/mongo.db";
// import { clearDb } from "../../utils/posts/clear-db";
// import { UserInputModel } from "../../../src/users/types/user-types";
// import request from "supertest";
// import { AUTH_PATH, COMMENTS_PATH } from "../../../src/core/paths";
// import { createBlog } from "../../utils/blogs/create-blog";
// import { BlogInputDto } from "../../../src/blogs/types/blogs-types";
// import { createPost } from "../../utils/posts/createPost";
// import { PostInputDto } from "../../../src/posts/types/posts-types";
// import { HttpStatus } from "../../../src/core/http-statuses";
// import {
//   CommentInputType,
//   ContentType,
// } from "../../../src/comments/types/commentsTypes";
// describe("Body API", () => {
//   const app = express();
//   setupApp(app);

//   const adminToken = generateBasicAuthToken();

//   beforeAll(async () => {
//     await runDB(
//       "mongodb+srv://admin:admin@cluster0.nm5nplv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
//     );
//     await clearDb(app);
//   });
//   afterAll(async () => {
//     await stopDb();
//   });

//   it("should create user,then auth user, then create blog, then create post, then create comment", async () => {
//     const userDto: UserInputModel = {
//       login: "slam",
//       email: "danmeon@mail.ru",
//       password: "emememdems",
//     };

//     const res = await request(app)
//       .post(COMMENTS_PATH)
//       .set("Authorization", generateBasicAuthToken())
//       .send(userDto)
//       .expect(HttpStatus.Created);

//     const authUserData = {
//       loginOrEmail: "slam",
//       password: "emememdems",
//     };
//     const authUser = await request(app)
//       .post(AUTH_PATH + "/auth/login")
//       .send(authUserData)
//       .expect(HttpStatus.Created);

//     const blogDto: BlogInputDto = {
//       name: "test1",
//       description: "test1",
//       websiteUrl: "https://samurai.it-incubator.io/swagger?id=h04",
//       createdAt: new Date(),
//       isMembership: false,
//     };
//     const createdBlog = await createBlog(app, blogDto);
//     const blogId = createdBlog.id;
//     const postDto: PostInputDto = {
//       title: "test1",
//       shortDescription: "sh1",
//       content: "c1",
//       blogId: blogId,
//     };
//     await createPost(app, postDto);

//     const commentData: ContentType = {
//       content: "Assalamu aleykum",
//     };

//     const res = await request(app)
//     .post(COMMENTS_PATH)

//   });
// });
