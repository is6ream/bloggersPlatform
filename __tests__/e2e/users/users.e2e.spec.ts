import express from "express";
import { setupApp } from "../../../src/setup-app";
import { generateBasicAuthToken } from "../../utils/posts/generate-admin-auth-token";
import { runDB, stopDb } from "../../../src/db/mongo.db";
import { clearDb } from "../../utils/posts/clear-db";
import { UserInputModel } from "../../../src/users/types/user-types";

describe("Users API", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB(
      "mongodb+srv://admin:admin@cluster0.nm5nplv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    await clearDb(app);
  });
  afterAll(async () => {
    await stopDb();
  });

  it("should create user; POST /api/users", async () => {
    const userDto: UserInputModel = {
      login: "dan2244",
      email: "dnlils10@icloud.com",
      password: "3213213213122133",
    };
    await cre
  });
});
