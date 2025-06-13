"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationAndSortingDefault = void 0;
exports.paginationAndSortingValidation = paginationAndSortingValidation;
const express_validator_1 = require("express-validator");
const sort_direction_1 = require("../../types/sort-direction");
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = sort_direction_1.SortDirection.desc;
const DEFAULT_SORT_BY = "createdAt";
exports.paginationAndSortingDefault = {
    pageNumber: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: DEFAULT_SORT_BY,
    sortDirection: DEFAULT_SORT_DIRECTION,
};
function paginationAndSortingValidation(sortFieldsEnum) {
    return [
        (0, express_validator_1.query)("pageNumber")
            .optional()
            .default(DEFAULT_PAGE)
            .isInt({ min: 1 })
            .withMessage("Page number must be a positive integer")
            .toInt(),
        (0, express_validator_1.query)("pageSize")
            .optional()
            .default(DEFAULT_PAGE_SIZE)
            .isInt({ min: 1, max: 100 })
            .withMessage("Page size must be between 1 and 100")
            .toInt(),
        (0, express_validator_1.query)("sortBy")
            .optional()
            .default(Object.values(sortFieldsEnum)[0])
            .isIn(Object.values(sortFieldsEnum))
            .withMessage(`Allowed sort fields: ${Object.values(sortFieldsEnum).join(", ")}`),
        (0, express_validator_1.query)("sortDirection")
            .optional()
            .default(DEFAULT_SORT_DIRECTION)
            .isIn(Object.values(sort_direction_1.SortDirection))
            .withMessage(`Sort direction must be one of: ${Object.values(sort_direction_1.SortDirection).join(", ")}`),
    ];
}
