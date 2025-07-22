import { setupApp } from "../../../src/setup-app";
import express from "express";
import { AuthAttributes, AuthCreateInput } from "./types";
import { getAuthDto } from "../../utils/auth/get-auth-dto";
import { generateBasicAuthToken } from "../../utils/posts/generate-admin-auth-token";
import { runDB, stopDb } from "../../../src/db/mongo.db";
import { clearDb } from "../../utils/posts/clear-db";
import request from "supertest";
import { AUTH_PATH } from "../../../src/core/paths";
import { HttpStatus } from "../../../src/core/http-statuses";

describe("Auth API body validation check", () => {
  const app = express();
  setupApp(app);

  const correctTestAuthAttributes: AuthAttributes = getAuthDto();

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB("mongodb://localhost:27017/ed-back-lessons-platform-test");
    await request(app)
      .post("/api/users")
      .set("Authorization", adminToken)
      .send(correctTestAuthAttributes);
  });

  afterAll(async () => {
    await clearDb(app);
    await stopDb();
  });

  it("should not auth when incorrect body passed; POST /api/auth/login", async () => {
    const incorrectTestAuthData: AuthCreateInput = {
      loginOrEmail: " ",
      passwordHash: "6857b81064ad31565ab05de0",
    };

    await request(app)
      .post(AUTH_PATH)
      .send(correctTestAuthAttributes)
      .expect(HttpStatus.Unauthorized);

    await request(app)
      .post(AUTH_PATH)
      .set("Authorization", adminToken)
      .send(incorrectTestAuthData)
      .expect(HttpStatus.BadRequest);
  });

  it("should auth successfully with correct credentials; POST /api/auth/login", async () => {
    await request(app)
      .post(AUTH_PATH)
      .send({
        loginOeEmail: correctTestAuthAttributes.loginOrEmail,
        passwordHash: correctTestAuthAttributes.passwordHash,
      })
      .expect(HttpStatus.NoContent);
  });
});
