import { Router } from "express";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { refreshTokenGuard } from "../../../core/guards/refreshTokenGuard";
import {
  sessionsQueryController,
  sessionsController,
} from "../../../compositionRoot";

export const securityDevicesRouter = Router();

securityDevicesRouter
  .get(
    "/",
    refreshTokenGuard,
    inputValidationResultMiddleware,
    sessionsQueryController.getAllDevices.bind(sessionsQueryController),
  )
  .delete(
    "/",
    refreshTokenGuard,
    inputValidationResultMiddleware,
    sessionsController.deleteAllDeviceSessions.bind(sessionsController),
  )
  .delete(
    "/:id",
    refreshTokenGuard,
    inputValidationResultMiddleware,
    sessionsController.deleteSessionByDeviceId.bind(sessionsController),
  );
