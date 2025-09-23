import express, { Express } from "express";
import { db } from "../../../../src/db/mongo.db";
import { setupApp } from "../../../../src/setup-app";
import { getFourSessions } from "../helpers/getFourSessions";
import { registerUser } from "../../auth/helpers/registerUser";
import { TestUserCredentials } from "../../users/createAndAuthUser";

describe("sessions flow check", () => {
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
  describe("tests with creating and updating sessions", () => {
    it("should create four sessions", async () => {
      const userCredentials: TestUserCredentials = {
        login: "test",
        email: "test@mail.ru",
        password: "test123456",
      };
      const deviceNames: string[] = ["iphone", "xiaomi", "huawei", "macBook"];

      await registerUser(app, userCredentials);
      const fourSessions: string[] = await getFourSessions(
        app,
        {
          loginOrEmail: userCredentials.login,
          password: userCredentials.password,
        },
        deviceNames,
      );

      expect(fourSessions.length).toBe(4);
    });
  });
});
