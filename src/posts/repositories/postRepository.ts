import { PostType } from "../types/posts-types";
import { PostInputDto } from "../types/posts-types";
import { ObjectId } from "mongodb";
import { postCollection } from "../../db/mongo.db";

export const postRepository = {
  async create(newPost: PostType): Promise<string> {
    const insertResult = await postCollection.insertOne(newPost);
    const insertedId = insertResult.insertedId;
    return insertedId.toString();
  },

  async createPostByBlogId(newPost: PostType): Promise<string> {
    const insertResult = await postCollection.insertOne(newPost);
    const insertedId = insertResult.insertedId;
    return insertedId.toString();
  },

  async findPostForCreateComment(id: string): Promise<any> {
    const post = await postCollection.findOne({ _id: new ObjectId(id) });
    return post;
  },

  async update(id: string, dto: PostInputDto): Promise<boolean> {
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
      }
    );
    return updateResult.modifiedCount === 1;
  },

  async delete(id: string): Promise<boolean> {
    const deleteResult = await postCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  },
};
