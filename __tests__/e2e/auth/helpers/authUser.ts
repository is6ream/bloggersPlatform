import { Express } from "express";
import { AuthDto } from "../types/types";
import request from "supertest";
import { AUTH_PATH } from "../../../../src/core/paths";
import { HttpStatus } from "../../../../src/core/http-statuses";
import { AuthCredentials } from "../../../../src/auth/types/input/login-input.models";

export async function loginUserWithDeviceName(
  app: Express,
  authDto: AuthCredentials,
  deviceName: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  const authCredentials: AuthDto = {
    loginOrEmail: authDto.loginOrEmail,
    password: authDto.password,
  };
  const response = await request(app)
    .post(`${AUTH_PATH}/login`)
    .set("userAgent", deviceName)
    .send(authCredentials)
    .expect(HttpStatus.Ok);

  return {
    accessToken: response.body.accessToken,
    refreshToken: response.headers["set-cookie"]?.[0],
  };
}
