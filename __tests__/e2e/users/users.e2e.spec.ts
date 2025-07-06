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
  const adminToken = generateBasicAuthToken();
  setupApp(app);
  beforeAll(async () => {
    await runDB(
      "mongodb+srv://admin:admin@cluster0.nm5nplv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    );
    await clearDb(app);
  }, 10000);
  afterAll(async () => {
    await stopDb();
  });

  it("should create user; POST /api/users", async () => {
    const userDto: UserInputModel = {
      login: "dan2244",
      email: "dnlils10@icloud.com",
      password: "3213213213122133",
    };

    const response = await request(app)
      .post(USERS_PATH)
      .set("Authorization", generateBasicAuthToken())
      .send(userDto)
      .expect(HttpStatus.Created);

    expect(response.body.login).toEqual(userDto.login);
  });

  it("should return users list; GET /api/users", async () => {
    await Promise.all([createUser(app), createUser(app)]);

    const response = await request(app).get(USERS_PATH).expect(HttpStatus.Ok);

    expect(response.body.items).toBeInstanceOf(Array);

    expect(response.body).toHaveProperty("pagesCount");
    expect(response.body).toHaveProperty("page");
    expect(response.body).toHaveProperty("pageSize");
    expect(response.body).toHaveProperty("totalCount");
  });

  it("should delete user; DELETE /api/users/:id", async () => {
    const createdUser = await createUser(app);
    const createdUserId = createdUser.id;

    await request(app)
      .delete(`${USERS_PATH}/${createdUserId}`)
      .set("Authorization", adminToken)
      .expect(HttpStatus.NoContent);
  });
});
