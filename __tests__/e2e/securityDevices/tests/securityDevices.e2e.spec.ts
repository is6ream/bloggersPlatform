import express, { Express } from "express";
import { db } from "../../../../src/db/mongo.db";
import { setupApp } from "../../../../src/setup-app";
import { getFourSessions } from "../helpers/getFourSessions";
import { registerUser } from "../../auth/helpers/registerUser";
import { TestUserCredentials } from "../../users/createAndAuthUser";
import { AuthReturnType } from "../types/authReturnTypes";
import request from "supertest";
import { AUTH_PATH, SECURITY_DEVICES_PATH } from "../../../../src/core/paths";
import { HttpStatus } from "../../../../src/core/http-statuses";
import { MongoMemoryServer } from "mongodb-memory-server";
import { loginUserWithDeviceName } from "../../auth/helpers/authUser";

describe("sessions flow tests", () => {
  const expressApp: Express = express();
  const app = setupApp(expressApp);

  beforeAll(async () => {
    //создаем монго сервер
    const mongoServer = await MongoMemoryServer.create();
    await db.runDB(mongoServer.getUri()); //передаем урл сервера для запуска
  });

  beforeEach(async () => {
    //перед каждым хуком удаляем данные
    await db.drop();
  });

  afterAll(async () => {
    await db.stop();
  });

  afterAll((done: any) => {
    done();
  });
  describe("tests with creating and updating sessions", () => {
    const userCredentials: TestUserCredentials = {
      login: "test",
      email: "test@mail.ru",
      password: "test123456",
    };
    beforeAll(async () => {
      await registerUser(app, userCredentials);
    });

    beforeEach(async () => {
      await db.drop();
    });
    it("should create four sessions", async () => {
      const deviceNames: string[] = ["iphone", "xiaomi", "huawei", "macBook"];
      const fourSessions: AuthReturnType = await getFourSessions(
        app,
        {
          loginOrEmail: userCredentials.login,
          password: userCredentials.password,
        },
        deviceNames,
      );
      expect(fourSessions.length).toBe(4);
    });

    it("should checking the last user activity", async () => {
      const authDate = new Date(); //время авторизации пользователя
      const authUser = await loginUserWithDeviceName(
        app,
        {
          loginOrEmail: userCredentials.login,
          password: userCredentials.password,
        },
        "Chrome",
      );

      const accessToken = authUser.accessToken;
      const response = await request(app) //делаем запрос для получения всех сессий
        .get(SECURITY_DEVICES_PATH)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(HttpStatus.Ok);
      console.log(response.body, "lastActiveDate");
      const difference = Math.abs(
        response.body.lastActiveDate * 1000 - authDate.getTime(),
      );

      expect(difference).toBeLessThan(3000); //сравниваем время при авторизации пользователя
      // и время iat с погрешностью в 3 сек
    });
  });
});
