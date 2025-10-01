import { Request } from "express";
import { ApiRequestLogDb } from "../customRateLimitType";
import { rateLimitCollection } from "../../../db/mongo.db";

export async function saveApiRequest(req: Request) {
  //создаем функцию, которая формирует объект запроса и записывает его в бд
  const apiRequestLog: ApiRequestLogDb = {
    ip: req.ip || "127.0.0.1",
    url: req.baseUrl,
    date: new Date(Date.now()),
  };

  await rateLimitCollection.insertOne(apiRequestLog);
  return;
}
