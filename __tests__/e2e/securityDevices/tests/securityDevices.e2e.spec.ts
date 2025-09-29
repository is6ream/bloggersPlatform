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
import {
  getRegisterCredentials,
  getUniqueCredentials,
} from "../helpers/getUserData";
import { getDeviceNames } from "../helpers/getDeviceNames";
import { SessionType } from "../types/sessionType";
import { SessionDB } from "../../../../src/securityDevices/types/sessionDataTypes";
import { registerUserMultiplyTimes } from "../helpers/registerUserMultiplyTimes";

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
        app,
        {
          loginOrEmail: userCredentials.login,
          password: userCredentials.password,
        },
        deviceNames,
      );
      expect(fourSessions.length).toBe(4);

      const accessToken = fourSessions[0].accessToken; //получаем токен после авторизации пользователя
      const getAllSessionsRes = await request(app) //делаем запрос для получения всех сессий
        .get(SECURITY_DEVICES_PATH)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);
      console.log(getAllSessionsRes.body);
      expect(getAllSessionsRes.body.length).toBe(4); //проверяем что возвращаются созданные ранее 4 сессии для одного пользователя
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
      const sessionTokens: AuthReturnType = await getFourSessions(
        //создаем четыре сессии для последующего удаления
        //авторизовываемся тут
        app,
        {
          loginOrEmail: userCredentials.login,
          password: userCredentials.password,
        },
        deviceNames,
      );
      expect(sessionTokens.length).toBe(4); //тест проходит

      const accessToken = sessionTokens[0].accessToken; //берем любой токен из массива наших токенов
      const refreshToken = sessionTokens[0].refreshToken;
      await request(app)
        .delete(SECURITY_DEVICES_PATH) //делаем запрос на удаление всех сессий
        .set("Cookie", refreshToken)
        .expect(HttpStatus.NoContent);

      const resAllSessions = await request(app) //делаем запрос на получение всех сессий для текущего пользователя
        .get(SECURITY_DEVICES_PATH)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(HttpStatus.Ok);

      expect(resAllSessions.body).toEqual([]); //после удаления данных должен вернуться пустой массив, проверяем это
    });

    it("should delete session by deviceId", async () => {
      const deviceNames: string[] = getDeviceNames();
      const sessionTokens: AuthReturnType = await getFourSessions(
        //создаем 4 сессии
        app,
        {
          loginOrEmail: userCredentials.login,
          password: userCredentials.password,
        },
        deviceNames,
      );
      const accessToken = sessionTokens[0].accessToken;
      const resAllSessions = await request(app) //делаем запрос для получения этих сессий, мне нужно получить доступ к полю deviceId
        .get(SECURITY_DEVICES_PATH)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(HttpStatus.Ok);

      const devices: SessionType[] = resAllSessions.body; //4 активные сессии для разных девайсов
      const iphoneSession: SessionType | undefined = devices.find(
        //находим сессию с устройства iphone для дальнейшего удаления
        (session) => (session.title as string) === "iphone",
      );
      const iphoneSessionDeviceId = iphoneSession?.deviceId;
      const refreshToken = sessionTokens[0].refreshToken; //получаем refreshToken из одной из созданных нами сессий ранее
      await request(app) //удаляем сессию
        .delete(`${SECURITY_DEVICES_PATH}/${iphoneSessionDeviceId}`)
        .set("Cookie", refreshToken)
        .expect(HttpStatus.NoContent);

      const resAfterDeletingSession = await request(app) //делаем снова запрос на получение всех сессий
        .get(SECURITY_DEVICES_PATH)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(HttpStatus.Ok);

      const findIphoneSession: SessionType | undefined =
        resAfterDeletingSession.body.find(
          (session: SessionType) => (session.title as string) === "iphone",
        ); //ищем сессию с title iphone
      expect(findIphoneSession).toBe(undefined);
    });
  });
  describe("rate limit flow tests", () => { //проходит
    it("should register user more than 5 times and throw err", async () => {
      const testCredentials: TestUserCredentials = getUniqueCredentials();
      await registerUserMultiplyTimes(app, testCredentials, 4);

      const res = await request(app)
        .post(`${AUTH_PATH}/registration`)
        .send(testCredentials)
        .expect(HttpStatus.TooManyRequests);
    });
  });
});
