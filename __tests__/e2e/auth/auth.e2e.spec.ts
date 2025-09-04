import express from "express";
import { setupApp } from "../../../src/setup-app";
import { db } from "../../../src/db/mongo.db";
describe("Auth API registration flow check", () => {
  beforeAll(async () => {
    await db.runDB("mongodb://localhost:27017/ed-back-lessons-platform-test");
    await db.drop();
    const app = express();
    setupApp(app);
  });

  
});

