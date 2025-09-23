import { describe } from "node:test";
import express, { Express } from "express";
import { db } from "../../../../src/db/mongo.db";
import { setupApp } from "../../../../src/setup-app";
import { testSeeder } from "../../../integration_test/testSeeder";
import request from "supertest";
import { AUTH_PATH, SECURITY_DEVICES_PATH } from "../../../../src/core/paths";
import { HttpStatus } from "../../../../src/core/http-statuses";
import { registerUser } from "../../auth/helpers/registerUser";
import { loginUser } from "../../auth/helpers/authUser";

describe("testing work with devices in sessions", () => {
  let app: Express;

  beforeAll(async () => {
    await db.runDB(
      "mongodb+srv://admin:admin@cluster0.x2itf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    );
    await db.drop();
    const expressApp = express();
    app = setupApp(expressApp);
  });

  afterAll(async () => {
    await db.drop();
    await db.stop();
  });
  describe("delete errors check", () => {
    const registeruser = await registerUser(app, {
      login: "test",
      email: "test@mail.com",
      password: "123456",
    });

    const user1 = await loginUser(
      app,
      {
        loginOrEmail: "test",
        password: "123456",
      },
      { userName: "iphone" },
    );
  });
});
