import { Router } from "express";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { deleteAllDeviceSessionsHandler } from "../handlers/deleteAllDevicesHandler";
import { getAllDevicesHandler } from "../handlers/getAllDevicesHandler";
import { refreshTokenGuard } from "../../../core/guards/refreshTokenGuard";
import { deleteSessionByDeviceIdHandler } from "../handlers/deleteSessionByDeviceIdHandler";

export const securityDevicesRouter = Router();

securityDevicesRouter
  .get(
    "/",
    refreshTokenGuard,
    inputValidationResultMiddleware,
    getAllDevicesHandler,
  )
  .delete(
    "/",
    refreshTokenGuard,
    inputValidationResultMiddleware,
    deleteAllDeviceSessionsHandler,
  )
  .delete(
    "/:id",
    refreshTokenGuard,
    inputValidationResultMiddleware,
    deleteSessionByDeviceIdHandler,
  );
//