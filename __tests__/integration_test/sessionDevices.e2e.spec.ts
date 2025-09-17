import { setupApp } from "./../../src/setup-app";
import { MongoMemoryServer } from "mongodb-memory-server";
import { sessionsRepository } from "./../../src/securityDevices/infrastructure/sessionsRepository";
import { Express } from "express";
import express from "express";
import { db } from "../../src/db/mongo.db";
import { SessionDataType } from "../../src/auth/types/input/login-input.models";
import { sessionCollection } from "../../src/db/mongo.db";

//TEST CREATING SESSION
describe("tests for securityDevices branch", () => {
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

  describe("securityDevices tests", () => {
    it("should write session data to the database", async () => {
      const sessionData: SessionDataType = {
        userId: "507f1f77bcf86cd799439011",
        deviceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        iat: new Date("2025-09-17T10:00:00.000Z").toString(),
        deviceName: "Chrome",
        ip: "192.168.1.1",
      };
      const transferSessionData =
        await sessionsRepository.createSession(sessionData); //нужно в методе createSession добавить возврат id сессии для проверки
      const savedSession = await sessionCollection.findOne({
        deviceId: sessionData.deviceId,
      });

      expect(savedSession).toBeDefined();
      expect(savedSession?.userId).toBe(sessionData.userId);
      expect(savedSession?.ip).toBe(sessionData.ip);
      expect(savedSession?.deviceName).toBe(sessionData.deviceName);
    });
  });
});
