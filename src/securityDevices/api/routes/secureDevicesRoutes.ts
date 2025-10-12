import { Router } from "express";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { refreshTokenGuard } from "../../../core/guards/refreshTokenGuard";
import { container } from "../../../container";
import { SessionsController } from "../controllers/sessionsController";
import { SessionsQueryController } from "../controllers/sessionsQueryController";

export const securityDevicesRouter = Router();
const sessionsController = container.get(SessionsController);
const sessionsQueryController = container.get(SessionsQueryController);

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
