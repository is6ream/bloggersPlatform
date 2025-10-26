import { SessionDB } from "./sessionDataTypes";
import { HydratedDocument, Schema, Model, model } from "mongoose";

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
