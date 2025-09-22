import { NextFunction, Request, Response } from "express";
import { ApiRequestLogDb } from "./customRateLimitType";
import { customRateLimitCollection } from "../../db/mongo.db";
import { HttpStatus } from "../http-statuses";

export const saveApiRequest = async (req: Request) => { //создаем функцию, которая формирует объект запроса и записывает его в бд
  const apiRequestLog: ApiRequestLogDb = {
    ip: req.ip || "127.0.0.1",
    url: req.baseUrl,
    date: new Date(),
  };

  await customRateLimitCollection.insertOne(apiRequestLog);
};

export const countApiRequest = (ip: string, url: string) => { //функция, которая считает запросы
  const tenSecondsAgo = new Date(Date.now() - 10000);

  const count = await customRateLimitCollection.countDocuments({
    ip: ip,
    url: url,
    date: { $gt: tenSecondsAgo }, //считает документы, которые были записаны в коллекцию за последние 10 секунд
  });

  return count > 5; //если больше 5, то true
};

export const customRateLimitMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const ip = req.ip || "127.0.0.1";
  const url = req.baseUrl;

  const isOverLimit = countApiRequest(ip, url); //считаем запросы за последние 10 сек

  if (isOverLimit) {
    res.status(HttpStatus.TooManyRequests).json({ error: "Too many requests" });
    await saveApiRequest(req);
  }

  await saveApiRequest(req);
  next();
};
