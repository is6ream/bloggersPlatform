import { Router } from "express";
import { accessTokenGuard } from "../../../core/guards/access.token.guard";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { deleteAllDeviceSessionsHandler } from "../handlers/deleteAllDevicesHandler";
import { getAllDevicesHandler } from "../handlers/getAllDevicesHandler";

export const securityDevicesRouter = Router();

securityDevicesRouter
  .get(
    "/",
    accessTokenGuard,
    inputValidationResultMiddleware,
    getAllDevicesHandler,
  )
  .delete(
    "/",
    accessTokenGuard,
    inputValidationResultMiddleware,
    deleteAllDeviceSessionsHandler,
  );
