"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultPaginationIfNotExist = setDefaultPaginationIfNotExist;
const query_pagination_sorting_validation_middleware_1 = require("../middlewares/query-pagination-sorting/query-pagination-sorting.validation-middleware");
function setDefaultPaginationIfNotExist(query) {
  var _a;
  return Object.assign(
    Object.assign(
      Object.assign(
        {},
        query_pagination_sorting_validation_middleware_1.paginationAndSortingDefault,
      ),
      query,
    ),
    {
      sortBy:
        (_a = query.sortBy) !== null && _a !== void 0
          ? _a
          : query_pagination_sorting_validation_middleware_1
              .paginationAndSortingDefault.sortBy,
    },
  );
}
