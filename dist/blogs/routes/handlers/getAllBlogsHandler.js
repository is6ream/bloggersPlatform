"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBlogsHandler = getAllBlogsHandler;
const http_statuses_1 = require("../../../core/http-statuses");
const set_default_sort_and_pagination_1 = require("../../../core/helpers/set-default-sort-and-pagination");
const blogs_service_1 = require("../../application/blogs.service");
const map_to_blog_list_paginated_output_util_1 = require("../mappers/map-to-blog-list-paginated-output.util");
function getAllBlogsHandler(req, res) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const queryInput = (0,
      set_default_sort_and_pagination_1.setDefaultPaginationIfNotExist)(
        req.query,
      );
      const { items, totalCount } =
        yield blogs_service_1.blogsService.findMany(queryInput);
      const blogsListOutput = (0,
      map_to_blog_list_paginated_output_util_1.mapToBlogListPaginatedOutput)(
        items,
        {
          pageNumber: queryInput.pageNumber,
          pageSize: queryInput.pageSize,
          totalCount,
        },
      );
      res.status(200).send(blogsListOutput);
    } catch (error) {
      console.log(error);
      res.sendStatus(http_statuses_1.HttpStatus.InternalServerError);
    }
  });
}
