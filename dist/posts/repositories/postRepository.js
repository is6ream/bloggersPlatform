"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRepository = void 0;
const db_1 = require("../../db/db");
exports.postRepository = {
  findAll() {
    return db_1.db.posts;
  },
  findById(id) {
    var _a;
    return (_a = db_1.db.posts.find((p) => p.id === id)) !== null &&
      _a !== void 0
      ? _a
      : null;
  },
  create(newPost) {
    db_1.db.posts.push(newPost);
    return newPost;
  },
  update(id, dto) {
    const post = db_1.db.posts.find((p) => p.id === id);
    if (!post) {
      throw new Error("Post not exist");
    }
    post.title = dto.title || post.title;
    post.shortDescription = dto.shortDescription || post.shortDescription;
    post.content = dto.content || post.content;
    post.blogId = dto.blogId || post.blogId;
    return;
  },
  delete(id) {
    const index = db_1.db.posts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("Post not exist");
    }
    return db_1.db.posts.splice(index, 1);
  },
};
