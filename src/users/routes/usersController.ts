import { Request, Response } from "express";
import { usersService } from "../application/users.service";
import { HttpStatus } from "../../core/http-statuses";
import { ResultStatus } from "../../core/result/resultCode";
import { resultCodeToHttpException } from "../../core/result/resultCodeToHttpException";
import { UserQueryInput } from "../input/user-query.input";
import { setDefaultPaginationIfNotExist } from "../../core/helpers/set-default-sort-and-pagination";
import { usersQueryRepository } from "../infrastructure/user.query.repository";
import { mapToUserListPaginatedOutput } from "./mappers/map-to-user-list-paginated-output.util";

export class UsersController {
  async createUser(req: Request, res: Response) {
    try {
      const result = await usersService.create(req.body);
      if (result.status !== ResultStatus.Success) {
        res
          .status(resultCodeToHttpException(result.status))
          .send(result.extensions);
        return;
      }
      const newUser = await usersService.findUser(result.data!);
      res.status(HttpStatus.Created).send(newUser.data!);
    } catch (err: unknown) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const id = req.params.id;

      const result = await usersService.delete(id);
      if (result.status !== ResultStatus.Success) {
        res.sendStatus(HttpStatus.NotFound);
      }
      res.sendStatus(HttpStatus.NoContent);
    } catch (error: unknown) {
      console.log(error);
      res.sendStatus(HttpStatus.InternalServerError);
    }
  }

  async getAllUsers(req: Request<{}, {}, {}, UserQueryInput>, res: Response) {
    try {
      const queryInput = setDefaultPaginationIfNotExist(req.query);

      const { items, totalCount } =
        await usersQueryRepository.findAll(queryInput);

      const usersListOutput = mapToUserListPaginatedOutput(items, {
        pageNumber: Number(queryInput.pageNumber),
        pageSize: Number(queryInput.pageSize),
        totalCount,
      });

      res.status(200).send(usersListOutput);
    } catch (error: unknown) {
      console.log(error);
      res.sendStatus(HttpStatus.InternalServerError);
    }
  }
}

export const usersController = new UsersController();
