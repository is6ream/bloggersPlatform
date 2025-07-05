import { setupApp } from "../../../src/setup-app";
import express from "express";
import { UserCreateInput, UserAttributes } from "./types";
import { getUserDto } from "../../utils/users/get-user-dto";
import { generateBasicAuthToken } from "../../utils/posts/generate-admin-auth-token";
import { runDB } from "../../../src/db/mongo.db";
import { clearDb } from "../../utils/posts/clear-db";
import { stopDb } from "../../../src/db/mongo.db";
import request from "supertest";
import { USERS_PATH } from "../../../src/core/paths";
import { HttpStatus } from "../../../src/core/http-statuses";

describe("User API body validation check", () => {
  const app = express();
  setupApp(app);

  const correctTestUserAttributes: UserAttributes = getUserDto();

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => { //создать отдельный кластер или коллекцию для подключения
    await runDB(
      "mongodb+srv://admin:admin@firstcluster.atxbolf.mongodb.net/?retryWrites=true&w=majority&appName=FirstCluster",
    );
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it("should not create user when incorrect body passed; POST /api/users", async () => {
    const incorrectTestUserData: UserCreateInput = {
      login: " ",
      password: " ",
      email: "damm@dasda.ru",
    };

    await request(app)
      .post(USERS_PATH)
      .send(correctTestUserAttributes)
      .expect(HttpStatus.Unauthorized);

    await request(app)
      .post(USERS_PATH)
      .set("Authorization", adminToken)
      .send(incorrectTestUserData)
      .expect(HttpStatus.BadRequest);
  });
});
