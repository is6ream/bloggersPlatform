"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToPostListPaginatedOutput = mapToPostListPaginatedOutput;
const resource_type_1 = require("../../core/types/resource-type");
function mapToPostListPaginatedOutput(posts, meta) {
    return {
        meta: {
            page: meta.pageNumber,
            pageSize: meta.pageSize,
            pageCount: Math.ceil(meta.totalCount / meta.pageSize),
            totalCount: meta.totalCount,
        },
        data: posts.map((post) => ({
            type: resource_type_1.ResourceType.Posts,
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        })),
    };
}
