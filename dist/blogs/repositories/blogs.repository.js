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
exports.blogsRepository = void 0;
const mongo_db_1 = require("../../db/mongo.db");
const mongodb_1 = require("mongodb");
exports.blogsRepository = {
  findAll() {
    return __awaiter(this, void 0, void 0, function* () {
      const blogs = yield mongo_db_1.blogCollection.find().toArray();
      return blogs.map((b) => ({
        id: b._id.toString(),
        name: b.name,
        description: b.description,
        websiteUrl: b.websiteUrl,
        createdAt: b.createdAt,
        isMembership: b.isMembership,
      }));
    });
  },
  findById(id) {
    return __awaiter(this, void 0, void 0, function* () {
      const blog = yield mongo_db_1.blogCollection.findOne({
        _id: new mongodb_1.ObjectId(id),
      });
      if (!blog) {
        return null;
      }
      return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
      };
    });
  },
  create(newBlog) {
    return __awaiter(this, void 0, void 0, function* () {
      const insertResult = yield mongo_db_1.blogCollection.insertOne(newBlog);
      const insertedId = insertResult.insertedId;
      return {
        id: insertedId.toString(),
        name: newBlog.name,
        description: newBlog.description,
        websiteUrl: newBlog.websiteUrl,
        createdAt: newBlog.createdAt,
        isMembership: newBlog.isMembership,
      };
    });
  },
  update(id, dto) {
    return __awaiter(this, void 0, void 0, function* () {
      const updateResult = yield mongo_db_1.blogCollection.updateOne(
        {
          _id: new mongodb_1.ObjectId(id),
        },
        {
          $set: {
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
          },
        },
      );
      if (updateResult.matchedCount < 1) {
        return null;
      }
      return;
    });
  },
  delete(id) {
    return __awaiter(this, void 0, void 0, function* () {
      const deleteResult = yield mongo_db_1.blogCollection.deleteOne({
        _id: new mongodb_1.ObjectId(id),
      });
      if (deleteResult.deletedCount < 1) {
        return null;
      }
      return;
    });
  },
  deleteAll() {
    return __awaiter(this, void 0, void 0, function* () {
      return yield mongo_db_1.blogCollection.drop();
    });
  },
};
