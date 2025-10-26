import { Request } from "express";
import { ApiRequestLogDb } from "../customRateLimitType";
import { rateLimitCollection } from "../../../db/mongo.db";
import {SessionModel} from "../../types/securityDevicesMongoose";

export async function saveApiRequest(req: Request) {
  //создаем функцию, которая формирует объект запроса и записывает его в бд
  const apiRequestLog: ApiRequestLogDb = {
    ip: req.ip || "127.0.0.1",
    url: req.originalUrl,
    date: new Date(),
  };

  await SessionModel.insertOne(apiRequestLog); //остановился тут
  return;
}
