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
exports.postRepository = void 0;
const mongodb_1 = require("mongodb");
const mongo_db_1 = require("../../db/mongo.db");
exports.postRepository = {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield mongo_db_1.postCollection.find().toArray();
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield mongo_db_1.postCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
        });
    },
    create(newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertResult = yield mongo_db_1.postCollection.insertOne(newPost);
            return Object.assign(Object.assign({}, newPost), { _id: insertResult.insertedId });
        });
    },
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateResult = yield mongo_db_1.postCollection.updateOne({
                _id: new mongodb_1.ObjectId(id),
            }, {
                $set: {
                    title: dto.title,
                    shortDescription: dto.shortDescription,
                    content: dto.content,
                    blogId: dto.blogId,
                },
            });
            if (updateResult.matchedCount < 1) {
                throw new Error("Post not exist");
            }
            return;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResult = yield mongo_db_1.postCollection.deleteOne({
                _id: new mongodb_1.ObjectId(id),
            });
            if (deleteResult.deletedCount < 1) {
                throw new Error("Post not exist");
            }
            return;
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return mongo_db_1.postCollection.drop();
        });
    },
};
