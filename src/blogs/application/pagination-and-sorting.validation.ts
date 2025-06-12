import { query } from "express-validator";
import { SortDirection } from "../types/sort-direction";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = SortDirection.Desc;

export function paginationAndSortingValidation