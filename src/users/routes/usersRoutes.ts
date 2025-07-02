import { Router } from "express";
import { paginationAndSortingValidation } from "../../core/middlewares/query-pagination-sorting/query-pagination-sorting.validation-middleware";
import { userSortField } from "../input/user-sort-field";
export const usersRouter = Router();

usersRouter.get("/", paginationAndSortingValidation(userSortField), getAllUsersHandler);
