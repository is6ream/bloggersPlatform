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
import { getFourSessions } from "../helpers/getFourSessions";

describe("testing work with devices in sessions", () => {
  let app: Express;

  beforeAll(async () => {
    await db.runDB(
      "mongodb+srv://admin:admin@cluster0.x2itf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
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
    it("should create for session and check delete errors", async () => {
      const authForDevices = await getFourSessions(app, {
        login: "test",
        email: "test@mail.ru",
        password: "test",
      });

      const firsUser = authForDevices.firstUser;
    });
  });
});
