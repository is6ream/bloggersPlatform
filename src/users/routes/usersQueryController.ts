import { UsersQueryRepository } from "../infrastructure/user.query.repository";
import { UserQueryInput } from "../input/user-query.input";
import { setDefaultPaginationIfNotExist } from "../../core/helpers/set-default-sort-and-pagination";
import { mapToUserListPaginatedOutput } from "./mappers/map-to-user-list-paginated-output.util";
import { HttpStatus } from "../../core/http-statuses";
import { Response, Request } from "express";
import { injectable } from "inversify";

@injectable()
export class UsersQueryController {
  constructor(private usersQueryRepository: UsersQueryRepository) {}
  async getAllUsers(req: Request<{}, {}, {}, UserQueryInput>, res: Response) {
    try {
      const queryInput = setDefaultPaginationIfNotExist(req.query);

      const { items, totalCount } =
        await this.usersQueryRepository.findAll(queryInput);

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
