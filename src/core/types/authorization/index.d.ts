import { IdType } from "./id";
import { DeviceIdType } from "./id";

declare global {
  declare namespace Express {
    export interface Request {
      userId: string | undefined;
      deviceId: string | undefined;
    }
  }
}
