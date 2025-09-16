import { Router } from "express";
import { accessTokenGuard } from "../../core/guards/access.token.guard";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { getAllDevicesHandler } from "./getAllDevicesHandler";

export const securityDevicesRoutes = Router();

securityDevicesRoutes.get(
  "/",
  accessTokenGuard,
  inputValidationResultMiddleware,
  getAllDevicesHandler,
);
