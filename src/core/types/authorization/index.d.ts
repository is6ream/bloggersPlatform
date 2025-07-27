import { Request } from "express";
import { IdType } from "./id";

declare global {
  declare namespace Express {
    export interface Request {
      user: IdType | undefined;
    }
  }
}
