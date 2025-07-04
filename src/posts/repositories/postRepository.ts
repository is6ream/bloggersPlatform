import { PostType, PostViewModel } from "../types/posts-types";
import { PostInputDto } from "../types/posts-types";
import { DeleteResult, ObjectId, WithId } from "mongodb";
import { postCollection } from "../../db/mongo.db";
import { PostQueryInput } from "../input/post-query.input";

export const postRepository = {
  async create(newPost: PostType): Promise<PostViewModel> {
    const insertResult = await postCollection.insertOne(newPost);
    const insertedId = insertResult.insertedId;
    return {
      id: insertedId.toString(),
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: newPost.blogId,
      blogName: newPost.blogName,
      createdAt: newPost.createdAt,
    };
  },

  async createPostByBlogId(newPost: PostType): Promise<PostViewModel> {
    const insertResult = await postCollection.insertOne(newPost);
    const insertedId = insertResult.insertedId;
    return {
      id: insertedId.toString(),
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: newPost.blogId,
      blogName: newPost.blogName,
      createdAt: newPost.createdAt,
    };
  },

  async update(id: string, dto: PostInputDto): Promise<void | null> {
    const updateResult = await postCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          title: dto.title,
          shortDescription: dto.shortDescription,
          content: dto.content,
          blogId: dto.blogId,
        },
      },
    );

    if (updateResult.matchedCount < 1) {
      return null;
    }
    return;
  },

  async delete(id: string): Promise<void | null> {
    const deleteResult = await postCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (deleteResult.deletedCount < 1) {
      return null;
    }
    return;
  },
};
