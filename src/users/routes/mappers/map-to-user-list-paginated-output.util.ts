import { UserViewModel } from "./../../types/user-types";
import { UserListPaginatedOutput } from "../../output/user-list-paginated.output";

export function mapToUserListPaginatedOutput(
  users: UserViewModel[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): UserListPaginatedOutput {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,

    items: users.map(
      (user): UserViewModel => ({
        id: user.id,
        login: user.login,
        password: user.password,
        email: user.email,
      }),
    ),
  };
}
