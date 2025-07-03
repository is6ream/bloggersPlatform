import { setDefaultPaginationIfNotExist } from "../../../core/helpers/set-default-sort-and-pagination";
import { UserQueryInput } from "../../input/user-query.input";
import { Request, Response } from "express";
import { mapToUserListPaginatedOutput } from "../mappers/map-to-user-list-paginated-output.util";
import { HttpStatus } from "../../../core/http-statuses";
export async function getAllUsersHandler(
  req: Request<{}, {}, {}, UserQueryInput>,
  res: Response,
) {
  try {
    const queryInput = setDefaultPaginationIfNotExist(req.query);

    const { items, totalCount } = usersService(queryInput);

    const usersListOutput = mapToUserListPaginatedOutput(items, {
      pageNumber: Number(queryInput.pageNumber),
      pageSize: Number(queryInput.pageSize),
      totalCount,
    });

    res.status(200).send(usersListOutput);
  } catch (error: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
