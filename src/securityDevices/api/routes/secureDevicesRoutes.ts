import { Router } from "express";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { sessionsController } from "../controller/sessionsController";
import { refreshTokenGuard } from "../../../core/guards/refreshTokenGuard";

export const securityDevicesRouter = Router();

securityDevicesRouter
  .get(
    "/",
    refreshTokenGuard,
    inputValidationResultMiddleware,
    sessionsController.getAllDevices,
  )
  .delete(
    "/",
    refreshTokenGuard,
    inputValidationResultMiddleware,
    sessionsController.deleteAllDeviceSessions,
  )
  .delete(
    "/:id",
    refreshTokenGuard,
    inputValidationResultMiddleware,
    sessionsController.deleteSessionByDeviceId,
  );
