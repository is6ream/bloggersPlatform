import { MongoMemoryServer } from "mongodb-memory-server";
import express, { Express } from "express";
import { db } from "../../src/db/mongo.db";
import { setupApp } from "../../src/setup-app";
import { authService } from "../../src/auth/application/auth.service";
import { ResultStatus } from "../../src/core/result/resultCode";
import { emailAdapter } from "../../src/auth/adapters/nodemailer.service";
import { testSeeder } from "./testSeeder";
import request from "supertest";
import { HttpStatus } from "../../src/core/http-statuses";
import { AUTH_PATH } from "../../src/core/paths";

describe("integration test for authservice", () => {
  let app: Express;
  let mongoServer: any;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    console.log("Test beforeAll: Starting db.run 11111111111111111");
    await db.runDB(uri);
    await db.drop();
    const expressApp = express();
    app = setupApp(expressApp);
  });

  afterAll(async () => {
    if (db.client) {
      try {
        await db.drop();
      } catch (e) {
        console.warn(
          "Drop failed in afterAll, possibly because client lost",
          e,
        );
      }
      await db.stop();
    }

    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  describe("User registration", () => {
    const registerUserUseCase = authService.registerUser;
    jest
      .spyOn(emailAdapter, "sendEmail")
      .mockReturnValue(Promise.resolve(true));

    it("should not register user twice", async () => {
      const { login, email, password } = testSeeder.createUserDto();

      const result = await registerUserUseCase(login, email, password);
      expect(result?.status).toBe(ResultStatus.BadRequest);
    });
  });

  describe("confirm email", () => {
    const confirmEmailCase = authService.confirmEmail;

    it("should not confirm email if user does not exist", async () => {
      const result = await confirmEmailCase("fdsfdsfdsF");

      expect(result.status).toBe(ResultStatus.BadRequest);
    });

    it("should not confirm email which is confirmed", async () => {
      const code = "test";

      const { login, password, email } = testSeeder.createUserDto();

      await testSeeder.insertUser({
        /**здесь мы кладем в базу сущность с кодом, который будем тестить далее,
         * сущность с поднятым флагом true */ login,
        password,
        email,
        code,
        isConfirmed: true,
      });

      const result = await confirmEmailCase(code);

      expect(result.status).toBe(ResultStatus.BadRequest);
    });

    it("confirm user", async () => {
      const code = "123e4567-e89b-12d3-a456-426614174000";

      const { login, password, email } = testSeeder.createUserDto();
      const user = await testSeeder.insertUser({
        login,
        password,
        email,
        code,
      });
      console.log(user);
      const result = await confirmEmailCase(code);

      expect(result.status).toBe(ResultStatus.Success);
    });

    it("should login user and return acessToken and refreshToken", async () => {
      const { login, password, email } = testSeeder.createUserDto();
      await testSeeder.insertUser({
        //эта функция не работает, т.к в чеккред падает ошибка, что юзер не найден по логину
        login,
        email,
        password,
      });
      const loginOrEmail = login;
      const res = await request(app)
        .post(AUTH_PATH + "/login")
        .send({ loginOrEmail, password })
        .expect(HttpStatus.Ok);

      expect(res.body.acessToken).toBeDefined();
      expect(res.headers["set cookie"]).toEqual(
        expect.arrayContaining([expect.stringContaining("refreshToken=")]),
      );
    });
  });
});
