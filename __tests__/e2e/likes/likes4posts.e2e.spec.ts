import express, { Express } from "express";
import { db } from "../../../src/db/runDb";
import { setupApp } from "../../../src/setup-app";
import { createPost } from "./utils/createPost";

describe("Testing likes for posts path branch", () => {
  let app: Express;
  beforeAll(async () => {
    await db.runDb();
    const expressApp = express();
    app = setupApp(expressApp);
  });
  beforeEach(async () => {
    await db.dropDb();
  });

  afterAll(async () => {
    await db.dropDb();
    await db.stopDb();
  });

  describe("Test for likes for posts command", () => {
    it("should create new like for post", async () => {
      const post = await createPost(app);
    });
  });
});
