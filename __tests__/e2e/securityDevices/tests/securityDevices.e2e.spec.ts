import express, { Express } from "express";
import { db } from "../../../../src/db/mongo.db";
import { setupApp } from "../../../../src/setup-app";
import { getFourSessions } from "../helpers/getFourSessions";
import { registerUser } from "../../auth/helpers/registerUser";
import { TestUserCredentials } from "../../users/createAndAuthUser";
import { AuthReturnType } from "../types/authReturnTypes";
import request from "supertest";
import { SECURITY_DEVICES_PATH } from "../../../../src/core/paths";
import { HttpStatus } from "../../../../src/core/http-statuses";
import { MongoMemoryServer } from "mongodb-memory-server";
import { loginUserWithDeviceName } from "../../auth/helpers/authUser";
import { getRegisterCredentials } from "../helpers/getUserData";
import { getDeviceNames } from "../helpers/getDeviceNames";

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
  describe("testing the creation and retrieval of all sessions", () => {
    const userCredentials: TestUserCredentials = getRegisterCredentials();
    beforeEach(async () => {
      await db.drop();
      await registerUser(app, userCredentials); //регистрируемся тут один раз
    });
    it("should create four sessions", async () => {
      const deviceNames: string[] = getDeviceNames();
      const fourSessions: AuthReturnType = await getFourSessions(
        //авторизовываемся тут
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
      const authDate = new Date().getTime(); //записываем время авторизации пользователя
      const credentials = {
        loginOrEmail: userCredentials.login,
        password: userCredentials.password,
      };
      const authUser = await loginUserWithDeviceName(
        //авторизовываемся
        app,
        credentials,
        "Chrome",
      );
      const accessToken = authUser.accessToken;
      const response = await request(app) //делаем запрос для получения всех сессий
        .get(SECURITY_DEVICES_PATH)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(HttpStatus.Ok);

      const currentSession = response.body.find(
        //ищем текущую сессию по deviceId
        (session: any) => session.title === "Chrome",
      );
      const lastActiveDate = +new Date(currentSession.lastActiveDate).getTime();
      const difference = Math.abs(lastActiveDate - authDate); //получаем разницу между временем авторизации пользователя и iat
      expect(difference).toBeLessThan(3000); //сравниваем время при авторизации пользователя
      // и время iat с погрешностью в 3 сек
    });
  });

  describe("testing delete all sessions and delete session by id", () => {
    const userCredentials: TestUserCredentials = getRegisterCredentials();
    beforeEach(async () => {
      await db.drop();
      await registerUser(app, userCredentials); //регистрируемся перед тестами
    });
    it("should delete all sessions", async () => {
      const deviceNames: string[] = getDeviceNames();
      const fourSessions: AuthReturnType = await getFourSessions(
        //создаем четыре сессии для последующего удаления
        //авторизовываемся тут
        app,
        {
          loginOrEmail: userCredentials.login,
          password: userCredentials.password,
        },
        deviceNames,
      );
      expect(fourSessions.length).toBe(4);//тест проходит
      // const response = await request(app)
      //     .delete(SECURITY_DEVICES_PATH)
      //     .set("Authorization", `Bearer `) //как из токенов передать?
    });
  });
});
