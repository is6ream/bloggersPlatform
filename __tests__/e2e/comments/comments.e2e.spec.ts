import express, { Express } from "express";
import { db } from "../../../src/db/mongo.db";
import { setupApp } from "../../../src/setup-app";
import { createComment } from "./createComment";

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
    it("should create new comment", async () => {
      await createComment(app);
    });
  });
});
