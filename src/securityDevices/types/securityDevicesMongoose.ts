import { SessionDB } from "./sessionDataTypes";
import { HydratedDocument, Schema, Model, model } from "mongoose";
import { ApiRequestLogDb } from "../customRateLimit/customRateLimitType";

export type SecurityDeviceModel = Model<SessionDB>;
export type SecurityDocument = HydratedDocument<SecurityDeviceModel>;

const sessionSchema = new Schema<SessionDB, SecurityDeviceModel>({
  userId: { type: String, unique: true, required: true },
  deviceId: { type: String, unique: true, required: true },
  iat: { type: String, required: true },
  deviceName: { type: String, required: true },
  ip: { type: String, required: true },
});

export const SessionModel = model<SessionDB, SecurityDeviceModel>(
  "sessionModel",
  sessionSchema,
);

//описал модель для сохранения запроса в бд
export type ApiRequestLogModel = Model<ApiRequestLogDb>;
export type ApiRequestLogDocument = HydratedDocument<ApiRequestLogModel>;

const apiRequestLogSchema = new Schema<ApiRequestLogDb, ApiRequestLogModel>({
  ip: { type: String, required: true },
  url: { type: String, required: true },
  date: { type: Date, required: true },
});

export const RequestLogModel = model<ApiRequestLogDb, ApiRequestLogDocument>( //т
  "apiRequestLog",
  apiRequestLogSchema,
);
