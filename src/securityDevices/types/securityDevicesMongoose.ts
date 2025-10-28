import { SessionDB } from "./sessionDataTypes";
import { HydratedDocument, Schema, model, Model } from "mongoose";
import { ApiRequestLogDb } from "../customRateLimit/customRateLimitType";

export type SecurityDeviceModel = Model<SessionDB>;
export type SecurityDocument = HydratedDocument<SecurityDeviceModel>;

const sessionSchema = new Schema<SessionDB, SecurityDeviceModel>({
  userId: { type: String, required: true },
  deviceId: { type: String, required: true },
  iat: {
    type: String,
    default: new Date(Date.now()).toISOString(), //для чего я захотел по дефолту установить Iat?
    required: true,
  },
  deviceName: { type: String, required: true },
  ip: { type: String, required: true },
});

export const SessionModel = model<SessionDB, SecurityDeviceModel>(
  "sessionModel",
  sessionSchema,
);
//-------------------------------------------
//описал модель для сохранения запроса в бд
export type ApiRequestLogModel = Model<ApiRequestLogDb>;
export type ApiRequestLogDocument = HydratedDocument<ApiRequestLogModel>;

const apiRequestLogSchema = new Schema<ApiRequestLogDb, ApiRequestLogModel>({
  ip: { type: String, required: true },
  url: { type: String, required: true },
  date: { type: Date, required: true },
});
//задача - через mongoose записать реквест в бд
export const RequestLogModel = model<ApiRequestLogDb, ApiRequestLogModel>( //т
  "apiRequestLog",
  apiRequestLogSchema,
);
