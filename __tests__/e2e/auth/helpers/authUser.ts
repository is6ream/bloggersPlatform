import { Express } from "express";
import { AuthDto } from "../types/types";
import request from "supertest";
import { AUTH_PATH } from "../../../../src/core/paths";
import { HttpStatus } from "../../../../src/core/http-statuses";
import { UserAuthType } from "../../securityDevices/types/userAuthType";

export async function loginUser(app: Express, authDto: UserAuthType) {
  const authCredentials: AuthDto = {
    loginOrEmail: authDto.login || authDto.email,
    password: authDto.password,
  };
  const response = await request(app)
    .post(`${AUTH_PATH}/login`)
    .set("userName", authDto.userAgent)
    .send(authCredentials)
    .expect(HttpStatus.Ok);

  return {
    accessToken: response.body.accessToken,
    refreshToken: response.headers["set-cookie"]?.[0],
  };
}
