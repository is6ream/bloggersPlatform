import { Router } from "express";
import { paginationAndSortingValidation } from "../../core/middlewares/query-pagination-sorting/query-pagination-sorting.validation-middleware";
import { UserSortField } from "../input/user-sort-field";
import { superAdminGuardMiddleware } from "../../core/middlewares/validation/super-admin.guard-middleware";
import { userValidators } from "../middlewares/user-input-dto-validator";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import { ioc } from "../../compositionRoot";
import { UsersController } from "./usersController";
import { UsersQueryController } from "./usersQueryController";

const usersController = ioc.getInstance<UsersController>(UsersController);
const usersQueryController =
  ioc.getInstance<UsersQueryController>(UsersQueryController);
export const usersRouter = Router();

usersRouter
  .get(
    "/",
    paginationAndSortingValidation(UserSortField),
    usersQueryController.getAllUsers.bind(usersQueryController),
  )
  .post(
    "/",
    superAdminGuardMiddleware,
    userValidators,
    inputValidationResultMiddleware,
    usersController.createUser.bind(usersController),
  )
  .delete(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    usersController.deleteUser.bind(usersController),
  );
