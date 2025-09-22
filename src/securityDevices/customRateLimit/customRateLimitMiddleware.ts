import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../core/http-statuses";
import { saveApiRequest } from "./helpers/saveApiRequest";
import { countApiRequest } from "./helpers/countApiRequest";

export async function customRateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const ip = req.ip || "127.0.0.1";
  const url = req.baseUrl;

  const isOverLimit = await countApiRequest(ip, url); //считаем запросы за последние 10 сек

  if (isOverLimit) {
    res.status(HttpStatus.TooManyRequests).json({ error: "Too many requests" });
    await saveApiRequest(req);
  }

  await saveApiRequest(req);
  next();
}
