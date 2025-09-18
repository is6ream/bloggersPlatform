import { SessionDataType } from "../../auth/types/input/login-input.models";

export type SessionDto = {
  deviceName: string;
  ip: string;
  loginOrEmail: string;
  password: string;
};
export type SessionDB = {
  userId: string;
  deviceId: string;
  iat: number;
  deviceName: string;
  ip: string;
};
