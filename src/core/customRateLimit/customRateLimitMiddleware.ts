import { NextFunction, Request, Response } from "express";
import { ApiRequestLogDb } from "./customRateLimitType";
import { rateLimitCollection } from "../../db/mongo.db";
import { HttpStatus } from "../http-statuses";

export async function saveApiRequest(req: Request) {
  //создаем функцию, которая формирует объект запроса и записывает его в бд
  const apiRequestLog: ApiRequestLogDb = {
    ip: req.ip || "127.0.0.1",
    url: req.baseUrl,
    date: new Date(),
  };

  await rateLimitCollection.insertOne(apiRequestLog);
  return;
}

export async function countApiRequest(ip: string, url: string) {
  //функция, которая считает запросы
  const tenSecondsAgo = new Date(Date.now() - 10000);

  const count = await rateLimitCollection.countDocuments({
    ip: ip,
    url: url,
    date: { $gt: tenSecondsAgo }, //считает документы, которые были записаны в коллекцию за последние 10 секунд
  });

  return count > 5; //если больше 5, то true
}

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
