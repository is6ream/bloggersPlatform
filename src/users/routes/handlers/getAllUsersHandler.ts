import { setDefaultPaginationIfNotExist } from "../../../core/helpers/set-default-sort-and-pagination";
import { UserQueryInput } from "../../input/user-query.input";
import { Request, Response } from "express";
export async function getAllUsersHandler(
  req: Request<{}, {}, {}, UserQueryInput>,
  res: Response
) {
    try {
        const queryInput = setDefaultPaginationIfNotExist(req.query);

        const { items, totalCount} = setDefaultPaginationIfNotExist(req.query);
    }
}
