import { Request } from "express";
import { IdType } from "../authorization/id";
import { DeviceIdType } from "../authorization/id";

export type RequestWithParams<P> = Request<P, {}, {}, {}>;
export type RequestWithBody<B> = Request<{}, {}, B, {}>;
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>;
export type RequestWithParamsAndUserId<P, U extends IdType> = Request<
  P,
  {},
  {},
  {},
  U
>;
export type RequestWithParamsAndDeviceId<P, U extends DeviceIdType> = Request<
  P,
  {},
  {},
  {},
  U
>;
export type RequestWithBodyAndParams<P = string, B = any> = Request<
  P,
  {},
  B,
  {}
>;
export type RequestWithQueryAndParams<P, Q> = Request<P, {}, {}, Q>;
export type RequestWithParamsAndBodyAndUserId<P, B, U extends IdType> = Request<
  P,
  {},
  B,
  {},
  U
>;
export type RequestWithParamsAndBody<P, B> = Request<P, {}, B, {}>;
export type RequestWithBodyAndUserId<B, U extends IdType> = Request<
  {},
  {},
  B,
  {},
  U
>;
export type RequestWithUserId<U extends IdType> = Request<{}, {}, {}, {}, U>;
export type RequestWithCookies = Request & {
  cookies: {
    refreshToken?: string;
  };
};
export type RequestWithUserIdAndCookies<U extends IdType> = Request<
  {},
  {},
  {},
  {},
  U
> & {
  cookies: {
    refreshToken?: string;
  };
};
export type RequestWithDeviceIdAndCookies<U extends DeviceIdType> = Request<
  {},
  {},
  {},
  {},
  U
> & {
  cookies: {
    refreshToken?: string;
  };
  deviceId: string;
};
