import { testSeeder } from "../../../integration_test/testSeeder";
import express from "express";
import { setupApp } from "../../../../src/setup-app";
import { db } from "../../../../src/db/mongo.db";
import request from "supertest";
import { HttpStatus } from "../../../../src/core/http-statuses";
import { Express } from "express";
import { AUTH_PATH } from "../../../../src/core/paths";

describe("Auth API authorization flow check", () => {
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
  it("should register, login, and refreshToken", async () => {
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

    const cookies = resLogin.headers["set-cookie"];
    expect(cookies).toBeDefined();
    const cookiesArr = Array.isArray(cookies) ? cookies : [cookies];
    const refreshToken = cookiesArr.find((c: string) =>
      c.startsWith("refreshToken="),
    );
    //Refresh
    const resRefresh = await request(app)
      .post(AUTH_PATH + "/refresh-token")
      .set("Cookie", refreshToken)
      .expect(HttpStatus.Ok);

    expect(resRefresh.body.accessToken).toBeDefined();

    const cookiesAfterRefresh = resRefresh.headers["set-cookie"];
    const newCookiesArr = Array.isArray(cookiesAfterRefresh)
      ? cookiesAfterRefresh
      : [cookiesAfterRefresh];
    const newRefreshToken = newCookiesArr.find((c: string) =>
      c.startsWith("refreshToken"),
    );
    await request(app)
      .post(AUTH_PATH + "/logout")
      .set("Cookie", newRefreshToken)
      .expect(HttpStatus.NoContent);
  });
});
