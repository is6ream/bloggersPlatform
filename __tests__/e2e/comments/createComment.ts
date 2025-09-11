import request from "supertest";
import { Express } from "express";
import { returnPostByBlogId } from "../utils/posts/createPostByBlogId";
import { createUserAndAuth } from "../users/createAndAuthUser";
import { POSTS_PATH } from "../../../src/core/paths";
import { HttpStatus } from "../../../src/core/http-statuses";

export const createComment = async (app: Express, postId?: string) => {
  let id: string;
  const token = await createUserAndAuth(app);

  if (postId) {
    id = postId;
    const createCommentRes = await request(app)
      .post(`${POSTS_PATH}/${id}}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "stringstringstringstring" })
      .expect(HttpStatus.Created);

    return createCommentRes.body;
  } else {
    const post = await returnPostByBlogId(app);

    const createCommentRes = await request(app)
      .post(`${POSTS_PATH}/${post.id}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "stringstringstringstring" })
      .expect(HttpStatus.Created);

    return createCommentRes.body;
  }
};
