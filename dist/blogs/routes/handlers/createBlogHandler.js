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
exports.createBlogHandler = createBlogHandler;
const blogs_repository_1 = require("../../repositories/blogs.repository");
function createBlogHandler(req, res) {
  return __awaiter(this, void 0, void 0, function* () {
    const newBlog = {
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    const dataForResponse =
      yield blogs_repository_1.blogsRepository.create(newBlog);
    res.status(201).send(dataForResponse);
  });
}
