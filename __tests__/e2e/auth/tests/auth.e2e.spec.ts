import { testSeeder } from "../../../integration_test/testSeeder";
import express from "express";
import { setupApp } from "../../../../src/setup-app";
import request from "supertest";
import { HttpStatus } from "../../../../src/core/http-statuses";
import { Express } from "express";
import { AUTH_PATH } from "../../../../src/core/paths";
import { db } from "../../../../src/db/runDb";

describe("Auth API authorization flow check", () => {
  let app: Express;
  beforeAll(async () => {
    await db.runDb();
    await db.dropDb();
    const expressApp = express();
    app = setupApp(expressApp);
  });

  afterAll(async () => {
    await db.dropDb();
    await db.stopDb();
  });
  const { login, password, email } = testSeeder.createUserDto();
  const registerCredentials = {
    login: login,
    password: password,
    email: email,
  };
  //Registration
  beforeAll(async () => {
    await request(app)
      .post(AUTH_PATH + "/registration")
      .send(registerCredentials);
    expect(HttpStatus.NoContent);
  });

  it("should register, login, logout, and refreshToken", async () => {
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
      .expect(HttpStatus.Ok); //здесь падает 401 ошибка

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
