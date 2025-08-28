import { Express } from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import { authService } from "./application/auth.service";
import { db } from "../db/db.for.tests";
import { ResultStatus } from "../core/result/resultCode";
import { setupApp } from "../setup-app";
// jest.setTimeout(20000); //увеличивает время ожидания выполнения теста
//нужно передать апп
describe("integration test for authservice", () => {
  let app: Express;
  beforeAll(async () => {
    app = setupApp(app);
    const mongoServer = await MongoMemoryServer.create();
    await db.run(mongoServer.getUri());
    await db.drop();
  });

  afterAll(async () => {
    await db.drop();
    await db.stop();
  });

  describe("createUser", () => {
    it("should return", async () => {
      const registerUserCase = authService.registerUser;
      const emailForTest = "example@example.com";
      const loginForTest = "v22S5M6CEB";
      const result = await registerUserCase(
        loginForTest,
        "string",
        emailForTest
      );

      expect(result?.status).toBe(ResultStatus.Success);
    });
  });
});
