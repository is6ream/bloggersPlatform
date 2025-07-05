import { Router } from "express";
import { paginationAndSortingValidation } from "../../core/middlewares/query-pagination-sorting/query-pagination-sorting.validation-middleware";
import { getAllUsersHandler } from "./handlers/getAllUsersHandler";
import { UserSortField } from "../input/user-sort-field";
import { superAdminGuardMiddleware } from "../../core/middlewares/validation/super-admin.guard-middleware";
import { userValidators } from "../middlewares/user-input-dto-validator";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { createUserHandler } from "./handlers/createUserHandler";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import { deleteUserHandler } from "./handlers/deleteUserHandler";
export const usersRouter = Router();

usersRouter
  .get("/", paginationAndSortingValidation(UserSortField), getAllUsersHandler)
  .post(
    "/",
    superAdminGuardMiddleware,
    userValidators,
    inputValidationResultMiddleware,
    createUserHandler,
  )
  .delete(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deleteUserHandler,
  );
