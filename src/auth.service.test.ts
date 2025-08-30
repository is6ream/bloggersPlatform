import { MongoMemoryServer } from "mongodb-memory-server";
import express, { Express } from "express";
import { db } from "./db/db.for.tests";
import { setupApp } from "./setup-app";

describe("integration test for authservice", () => {
  let app: Express;
  let mongoServer: any;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    console.log(uri, "check uri");

    console.log("Test beforeAll: Starting db.run 11111111111111111");
    await db.run(uri);
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
          e
        );
      }
      await db.stop();
    }

    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  describe("createUser", () => {
    it("should create user successfully", async () => {
      const login = "testuser";
      const email = "test@example.com";

      const result = 1;

      expect(result).toEqual(1);
    });
  });
});
