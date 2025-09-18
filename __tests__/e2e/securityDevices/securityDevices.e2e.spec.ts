import { describe } from "node:test";
import express, { Express } from "express";
import { db } from "../../../src/db/mongo.db";
import { setupApp } from "../../../src/setup-app";
import { testSeeder } from "../../integration_test/testSeeder";
import request from "supertest";
import { AUTH_PATH, SECURITY_DEVICES_PATH } from "../../../src/core/paths";
import { HttpStatus } from "../../../src/core/http-statuses";

describe("testing work with devices in sessions", () => {
  let app: Express;

  beforeAll(async () => {
    await db.runDB(
      "mongodb+srv://admin:admin@cluster0.x2itf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    );
    await db.drop();
    const expressApp = express();
    app = setupApp(expressApp);
  });

  afterAll(async () => {
    await db.drop();
    await db.stop();
  });
  //дескрай - "should register, login and get all devices in session
  // -  регистр
  // - логин
  // -девайсв получить
  it("should register, login and get all devices in session", async () => {
    const { login, password, email } = testSeeder.createUserDto();
    const registerCredentials = {
      login: login,
      password: password,
      email: email,
    };
    //Registration
    await request(app)
      .post(AUTH_PATH + "/registration")
      .send(registerCredentials);
    expect(HttpStatus.NoContent);
    //Login
    const loginCredentials = { loginOrEmail: login, password: password };
    const resLogin = await request(app)
      .post(AUTH_PATH + "/login")
      .send(loginCredentials)
      .expect(HttpStatus.Ok);
    expect(resLogin.body.accessToken).toBeDefined();
    expect(resLogin.headers["set cookie"]);
    const accessToken = await resLogin.body.accessToken;

    const cookies = resLogin.headers["set-cookie"];
    expect(cookies).toBeDefined();
    const resAllSessions = await request(app)
      .get(SECURITY_DEVICES_PATH)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(HttpStatus.Ok);

    expect(resAllSessions.body).toBeDefined();
  });
});
