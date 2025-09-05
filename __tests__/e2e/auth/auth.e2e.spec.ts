import { testSeeder } from "./../../integration_test/testSeeder";
import express from "express";
import { setupApp } from "../../../src/setup-app";
import { db } from "../../../src/db/mongo.db";
import request from "supertest";
import { HttpStatus } from "../../../src/core/http-statuses";
import { Express } from "express";
describe("Auth API authorization flow check", () => {
  let app: Express;
  beforeAll(async () => {
    await db.runDB(
      "mongodb+srv://admin:admin@cluster0.x2itf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    await db.drop();
    const expressApp = express();
    app = setupApp(expressApp);
  });

  afterAll(async () => {
    await db.drop();
    await db.stop();
  });

  it("should register user", async () => {
    const user = testSeeder.createUserDto();
    await request(app).post("/hometask_08/api/auth/registration").send(user);
    expect(HttpStatus.NoContent);
  });

  it("should  auth user and get acess and refresh token", async () => {
    const { login, password } = testSeeder.createUserDto();
    const credentials = { loginOrEmail: login, password: password };
    const res = await request(app)
      .post("/hometask_08/api/auth/login")
      .send(credentials)
      .expect(HttpStatus.Ok);
    console.log(res.body);
    expect(res.body.aсcessToken).toBeDefined();
    expect(res.headers["set cookie"]);
  });
});
