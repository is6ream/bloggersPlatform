"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
const db_1 = require("../../db");
exports.blogsRepository = {
  findAll() {
    return db_1.db.blogs;
  },
  findById(id) {
    var _a;
    return (_a = db_1.db.blogs.find((b) => b.id === id)) !== null &&
      _a !== void 0
      ? _a
      : null;
  },
  create(newBlog) {
    db_1.db.blogs.push(newBlog);
    return newBlog;
  },
  update(id, dto) {
    const blog = db_1.db.blogs.find((b) => b.id === id);
    if (!blog) {
      throw new Error("Blog not exist");
    }
    blog.name = dto.name || blog.name;
    blog.description = dto.description || blog.description;
    blog.websiteUrl = dto.websiteUrl || blog.websiteUrl;
    return;
  },
  delete(id) {
    const index = db_1.db.blogs.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new Error("Video not exist");
    }
    db_1.db.blogs.splice(index, 1);
    return;
  },
  deleteAll() {
    db_1.db.blogs = [];
    return;
  },
};
