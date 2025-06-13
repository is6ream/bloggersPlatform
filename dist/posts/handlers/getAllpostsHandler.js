"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPostsHandler = getAllPostsHandler;
const http_statuses_1 = require("../../core/http-statuses");
const postRepository_1 = require("../repositories/postRepository");
const set_default_sort_and_pagination_1 = require("../../core/helpers/set-default-sort-and-pagination");
function getAllPostsHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const queryInput = (0, set_default_sort_and_pagination_1.setDefaultPaginationIfNotExist)(req.query);
            const { items, totalCount } = yield ;
        }
        finally {
        }
        const posts = yield postRepository_1.postRepository.findAll();
        res.status(http_statuses_1.HttpStatus.Ok).json(posts);
    });
}
