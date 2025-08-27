import { MongoMemoryServer } from "mongodb-memory-server";
import { authService } from "./application/auth.service";
import { MongoClient } from "mongodb";

describe("integration test for authservice", async () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
  });
  const mongoUri =  mongoServer.getUri();
  let client: MongoClient;
  client = new MongoClient(mongoUri);
  await client.connect();

  describe("createUser", () => {
    it("should return", async () => {
      const emailForTest = "example@example.com";
      const loginForTest = "v22S5M6CEB";
      const result = await authService.registerUser(
        loginForTest,
        "string",
        emailForTest
      );

      expect(result?.data?.email).toBe(emailForTest);
      expect(result?.data?.login).toBe(loginForTest);
      expect(result?.data?.emailConfirmation?.isConfirmed).toBe(false);
    });
  });
});
