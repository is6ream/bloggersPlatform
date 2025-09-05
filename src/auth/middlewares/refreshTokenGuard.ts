import { NextFunction, Request, Response } from "express";
import { RequestWithRefreshToken } from "../controller/refreshToken.controller";
import { HttpStatus } from "../../core/http-statuses";
export const refreshTokenGuard = async(
  req: RequestWithRefreshToken,
  res: Response,
  next: NextFunction
) => {
    const refreshToken = req.cookies?.refreshToken

    if(!refreshToken){
        res.sendStatus(HttpStatus.Unauthorized)
        return
    }
    const isBlackListed = await 
}