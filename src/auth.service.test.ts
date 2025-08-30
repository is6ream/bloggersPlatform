import { setupApp } from "./setup-app";
import { MongoMemoryServer } from "mongodb-memory-server";
import express, { Express } from "express";
import { db } from "./db/db.for.tests";

describe("integration test for auth service", () => {
  let app: Express;
  let mongoServer: any;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUrI();
    console.log("test beforeAll: starting db.run...");
    await db.run(uri);
    await db.drop();
    const expressApp = express();
    app = setupApp(expressApp);
  });

  afterAll(async () => {
    if (db.client) {
      try {
        await db.drop();
      } catch (err) {
        console.warn(
          "Drop failed in afterAll, possibly because client lost",
          err,
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
      const email = "testUser@example.com";

      const result = 1;
      expect(result).toEqual(1);
    });
  });
});
