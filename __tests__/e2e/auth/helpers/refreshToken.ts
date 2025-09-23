import { Express } from "express";
import request from "supertest";
import { AUTH_PATH } from "../../../../src/core/paths";
import { HttpStatus } from "../../../../src/core/http-statuses";

export async function refreshToken(app: Express, refreshToken: string) {
  const response = await request(app)
    .post(`${AUTH_PATH}/refreshToken`)
    .set("Cookie", [`refreshToken=${refreshToken}`])
    .expect(HttpStatus.OK);

  return {
    newAccessToken: response.body.accessToken,
    newRefreshToken: response.headers["set-cookie"]?.[0],
  };
}
