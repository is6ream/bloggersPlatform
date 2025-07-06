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
    await runDB(
      "mongodb+srv://admin:admin@cluster0.nm5nplv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    );
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it("should not create auth when incorrect body passed; POST /api/auth/login", async () => {
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
});
