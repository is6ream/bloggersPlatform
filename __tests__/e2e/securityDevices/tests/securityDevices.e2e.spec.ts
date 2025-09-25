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
import { beforeEach } from "node:test";

describe("sessions flow tests", () => {
  const expressApp: Express = express();
  const app = setupApp(expressApp);

  beforeAll(async () => {
    //изначально создаем монго сервер
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
    beforeEach(async () => {
      await db.drop();
    });
    const deviceNames: string[] = ["iphone", "xiaomi", "huawei", "macBook"];

    it("should create four sessions", async () => {
      await registerUser(app, userCredentials); //почему-то падает 400 ошибка, которая говорит о том, что пользователь
      //есть в бд, но я чищу бд перед тестами ДВА РАЗА
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
      await registerUser(app, userCredentials);
      const authDate = new Date(); //время авторизации пользователя
      const loginUserResponse = await request(app) //авторизуем пользователя и создаем сессию
        .post(`${AUTH_PATH}/login`)
        .send({
          loginOrEmail: userCredentials.login,
          password: userCredentials.password,
        })
        .expect(HttpStatus.Ok);

      const accessToken = loginUserResponse.body.access_token;

      const response = await request(app) //делаем запрос за получением всех сессий
        .get(SECURITY_DEVICES_PATH)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(HttpStatus.Ok);
      const difference = Math.abs(
        response.body.lastActiveDate * 1000 - authDate.getTime(),
      );

      expect(difference).toBeLessThan(3000); //сравниваем время при авторизации пользователя
      // и время iat с погрешностью в 3 сек
    });
  });
});
