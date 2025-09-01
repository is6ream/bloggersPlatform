import { MongoMemoryServer } from "mongodb-memory-server";
import express, { Express } from "express";
import { db } from "../../src/db/mongo.db";
import { setupApp } from "../../src/setup-app";
import { authService } from "../../src/auth/application/auth.service";
import { ResultStatus } from "../../src/core/result/resultCode";
import { emailAdapter } from "../../src/auth/adapters/nodemailer.service";
import { testSeeder } from "./testSeeder";

describe("integration test for authservice", () => {
  let app: Express;
  let mongoServer: any;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create(); //создаем дб и запускаем ее
    const uri = mongoServer.getUri();
    //пойти на саппорт и разобраться с подлкючением к бд
    console.log("Test beforeAll: Starting db.run 11111111111111111");
    await db.runDB(uri); //тут падает ошибка
    await db.drop(); //зачищаем перед тестами
    const expressApp = express();
    app = setupApp(expressApp);
  }, 60000);

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

    it("should register new user", async () => {
      const { login, email, pass } = testSeeder.createUserDto();
      const result = await registerUserUseCase(login, email, pass);
      expect(result?.status).toBe(ResultStatus.Success);
      expect(emailAdapter.sendEmail).toBeCalled();
      expect(emailAdapter.sendEmail).toHaveBeenCalledTimes(1);
    });

    it("should not register user twice", async () => {
      const { login, email, pass } = testSeeder.createUserDto();

      const result = await registerUserUseCase(login, email, pass);
      expect(result?.status).toBe(ResultStatus.BadRequest);
    });
  });

  describe("confirm email", () => {
    const confirmEmailCase = authService.confirmEmail;

    it("should not confirm email if user does not exist", async () => {
      const result = await confirmEmailCase("fdsfdsfdsF");

      expect(result.status).toBe(ResultStatus.BadRequest);
    });

    // it("should not confirm email which is confirmed", async () => {
    //   const code = "test";

    //   const { login, pass, email } = testSeeder.createUserDto();

    //   await testSeeder.insertUser({
    //     /**здесь мы кладем в базу сущность с кодом, который будем тестить далее,
    //      * сущность с поднятым флагом true */ login,
    //     pass,
    //     email,
    //     code,
    //     isConfirmed: true,
    //   });

    //   const result = await confirmEmailCase(code);

    //   expect(result.status).toBe(ResultStatus.BadRequest);
    // });

    //   it("confirm user", async () => {
    //     const code = "123e4567-e89b-12d3-a456-426614174000";

    //     const { login, pass, email } = testSeeder.createUserDto();
    //     await testSeeder.insertUser({ login, pass, email, code });

    //     const result = await confirmEmailCase(code);

    //     expect(result.status).toBe(ResultStatus.Success);
    //   });
  });
});
