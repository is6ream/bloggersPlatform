import { UserInputModel } from "../../../src/users/types/user-types";
import { Express } from "express";
import request from "supertest";
import { USERS_PATH } from "../../../src/core/paths";
import { generateBasicAuthToken } from "../utils/secure/genBasicAuthToken";
import { HttpStatus } from "../../../src/core/http-statuses";
import { AUTH_PATH } from "../../../src/core/paths";
import { getUserCredentials } from "./getUserCredentials";

export type TestUserCredentials = {
  login: string;
  email: string;
  password: string;
};
export const createUserAndAuth = async (
  app: Express,
  credentials?: TestUserCredentials,
) => {
  if (credentials) {
    await request(app)
      .post(USERS_PATH)
      .set("Authorization", generateBasicAuthToken())
      .send({
        login: credentials.login,
        password: credentials.password,
        email: credentials.email,
      })
      .expect(HttpStatus.Created);

    const loginUserRes = await request(app)
      .post(AUTH_PATH + "/login")
      .send({ loginOrEmail: credentials.login, password: credentials.password })
      .expect(HttpStatus.Ok);

    expect(loginUserRes.body.accessToken).toBeDefined();
    return loginUserRes.body.accessToken;
  } else {
    const { login, email, password } = getUserCredentials();
    await request(app)
      .post(USERS_PATH)
      .set("Authorization", generateBasicAuthToken())
      .send({
        login: login,
        password: password,
        email: email,
      })
      .expect(HttpStatus.Created);

    const loginUserRes = await request(app)
      .post(AUTH_PATH + "/login")
      .send({ loginOrEmail: login, password: password })
      .expect(HttpStatus.Ok);

    expect(loginUserRes.body.accessToken).toBeDefined();
    return loginUserRes.body.accessToken;
  }
};
