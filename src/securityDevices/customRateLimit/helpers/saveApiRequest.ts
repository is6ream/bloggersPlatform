import { Request } from "express";
import { ApiRequestLogDb } from "../customRateLimitType";
import { RequestLogModel } from "../../types/securityDevicesMongoose";

export async function saveApiRequest(req: Request) {
  //создаем функцию, которая формирует объект запроса и записывает его в бд
  const apiRequestLog: ApiRequestLogDb = {
    ip: req.ip || "127.0.0.1",
    url: req.originalUrl,
    date: new Date(),
  }; //этот объект к сессиям никак не относится, он нужен, чтобы сохранить факт запроса
  const requestLog = new RequestLogModel();
  requestLog.ip = apiRequestLog.ip;
  requestLog.url = apiRequestLog.url;
  requestLog.date = apiRequestLog.date;
  await requestLog.save(); //тип Model не добавляет метода save?
}
