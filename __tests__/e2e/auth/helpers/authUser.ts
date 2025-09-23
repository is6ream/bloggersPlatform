import { Express } from "express";
import { AuthDto } from "../types/types";
import request from "supertest";
import { AUTH_PATH } from "../../../../src/core/paths";
import { HttpStatus } from "../../../../src/core/http-statuses";

export async function loginUser(app: Express, authDto: AuthDto) {
  const authCredentials: AuthDto = {
    loginOrEmail: authDto.loginOrEmail,
    password: authDto.password,
  };
  const response = await request(app)
    .post(`${AUTH_PATH}/login`)
    .send(authCredentials)
    .expect(HttpStatus.Ok);

  return {
    accessToken: response.body.accessToken,
    refreshToken: response.headers["set-cookie"]?.[0],
  };
}
