import express, { Express } from "express";
import { setupApp } from "../../../src/setup-app";
import { db } from "../../../src/db/mongo.db";
import { UserInputModel } from "../../../src/users/types/user-types";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { USERS_PATH } from "../../../src/core/paths";
import { HttpStatus } from "../../../src/core/http-statuses";
import { generateBasicAuthToken } from "../utils/secure/genBasicAuthToken";
import { getUserCredentials } from "./getUserCredentials";
describe("users tests flow", () => {
  const expressApp: Express = express();
  const app = setupApp(expressApp);
  beforeAll(async () => {
    //создаем монго сервер
    const mongoServer = await MongoMemoryServer.create();
    await db.runDB(mongoServer.getUri()); //передаем урл сервера для запуска
  });
  beforeEach(async () => {
    await db.drop();
  });
  afterAll(async () => {
    await db.stop();
  });
  describe("testing create, delete and get all users flow", () => {
    it("should create new user and return it", async () => {
      const user: UserInputModel = getUserCredentials();
      await request(app)
        .post(USERS_PATH)
        .set("Authorization", generateBasicAuthToken())
        .send(user)
        .expect(HttpStatus.Created);

      const getUsers = await request(app).get(USERS_PATH).expect(HttpStatus.Ok);
      expect(getUsers.body.items.length).toEqual(1);
    });
    it("should delete user after creating", async () => {
      const user: UserInputModel = getUserCredentials();
      const res = await request(app)
        .post(USERS_PATH)
        .set("Authorization", generateBasicAuthToken())
        .send(user)
        .expect(HttpStatus.Created);

      const userId = res.body.id;

      const deleteRes = await request(app)
        .delete(`${USERS_PATH}/${userId}`)
        .set("Authorization", generateBasicAuthToken())
        .expect(HttpStatus.NoContent);
    });
  });
});
