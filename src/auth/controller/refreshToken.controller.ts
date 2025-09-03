import { Request, Response } from "express";

export interface RequestWithCookies extends Request {
  cookies: {
    refreshToken?: string;
  };
}
export async function refreshTokenController(
  req: RequestWithCookies,
  res: Response
) {
  const refreshToken = req.cookies.refreshToken;


}
