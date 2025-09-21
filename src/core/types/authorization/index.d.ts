import { IdType } from "./id";
import { DeviceIdType } from "./id";

declare global {
  declare namespace Express {
    export interface Request {
      user: IdType | undefined;
      deviceId: DeviceIdType | undefined;
    }
  }
}
