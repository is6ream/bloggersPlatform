import { UserViewModel } from "../types/user-types";

export type UserListPaginatedOutput = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UserViewModel[];
};
