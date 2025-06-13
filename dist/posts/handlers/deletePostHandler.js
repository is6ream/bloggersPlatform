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
exports.deletePostHandler = deletePostHandler;
const http_statuses_1 = require("../../core/http-statuses");
const postRepository_1 = require("../repositories/postRepository");
const error_utils_1 = require("../../core/error.utils");
function deletePostHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const result = yield postRepository_1.postRepository.delete(id);
            if (result === null) {
                res
                    .status(http_statuses_1.HttpStatus.NotFound)
                    .send((0, error_utils_1.createErrorMessages)([{ field: "id", message: "Blog not found" }]));
                return;
            }
            else {
                res.status(http_statuses_1.HttpStatus.NoContent).send();
            }
            return;
        }
        catch (error) {
            console.log(error);
            res.sendStatus(http_statuses_1.HttpStatus.NoContent);
            return;
        }
    });
}
