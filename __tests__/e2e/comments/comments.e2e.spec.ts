import express, { Express } from "express";
import { db } from "../../../src/db/mongo.db";
import { setupApp } from "../../../src/setup-app";
import { testSeeder } from "../../integration_test/testSeeder";
import { COMMENTS_PATH } from "../../../src/core/paths";
import { HttpStatus } from "../../../src/core/http-statuses";
import request from "supertest";
import { createComment } from "./createComment";
import { CreateCommentResult } from "./types";

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
  describe("Tests for comments branch", () => {
    it("should create new comment", async () => {
      await createComment(app);
    });

    it("should delete comment", async () => {
      const comment: CreateCommentResult = await createComment(app);
      await request(app)
        .delete(`${COMMENTS_PATH}/${comment.commentId}`)
        .set("Authorization", `Bearer ${comment.accessToken}`)
        .expect(HttpStatus.NoContent);
    });

    it("should update comment", async () => {
      const comment: CreateCommentResult = await createComment(app);
      console.log(comment.commentId, "id check");
      const updatedComment = { content: "newstringstringstrinstring" };
      await request(app)
        .put(`${COMMENTS_PATH}/${comment.commentId}`)
        .set("Authorization", `Bearer ${comment.accessToken}`)
        .send(updatedComment)
        .expect(HttpStatus.NoContent);
    });

    it("should create and get comment", async () => {
      const comment: CreateCommentResult = await createComment(app);
      const res = await request(app)
        .get(`${COMMENTS_PATH}/${comment.commentId}`)
        .expect(HttpStatus.Ok);

      expect(res.body.content).toEqual(comment.comment);
    });
  });
});
