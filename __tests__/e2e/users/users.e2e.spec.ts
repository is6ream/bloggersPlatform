import express from "express";
import { setupApp } from "../../../src/setup-app";
import { generateBasicAuthToken } from "../../utils/posts/generate-admin-auth-token";
import { runDB, stopDb } from "../../../src/db/mongo.db";
import { clearDb } from "../../utils/posts/clear-db";
import { UserInputModel } from "../../../src/users/types/user-types";
import { createUser } from "../../utils/users/create-user";
import request from "supertest";
import { USERS_PATH } from "../../../src/core/paths";
import { HttpStatus } from "../../../src/core/http-statuses";
import { getUserById } from "../../utils/users/get-user-by-id";
describe("Users API", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB(
      "mongodb+srv://admin:admin@cluster0.nm5nplv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
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
    const createdUser = await createUser(app, userDto);
    const createdUserID = createdUser.id;

    const user = await getUserById(app, createdUserID);

    expect(userDto.login).toEqual(createdUser.login);
  });
});
