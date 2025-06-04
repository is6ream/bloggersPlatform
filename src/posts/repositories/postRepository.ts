import { PostType } from "../types/posts-types";
import { PostInputDto } from "../types/posts-types";
import { ObjectId, WithId } from "mongodb";
import { postCollection } from "../../db/mongo.db";

export const postRepository = {
  async findAll(): Promise<WithId<PostType>[]> {
    return await postCollection.find().toArray();
  },

  async findById(id: string): Promise<WithId<PostType> | null> {
    return await postCollection.findOne({ _id: new ObjectId(id) });
  },

  async create(newPost: PostType): Promise<WithId<PostType>> {
    const insertResult = await postCollection.insertOne(newPost);
    return { ...newPost, _id: insertResult.insertedId };
  },

  async update(id: string, dto: PostInputDto): Promise<void> {
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

    if (updateResult.matchedCount < 1) {
      throw new Error("Post not exist");
    }
    return;
  },

  async delete(id: string): Promise<void> {
    const deleteResult = await postCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (deleteResult.deletedCount < 1) {
      throw new Error("Post not exist");
    }
    return;
  },

  async deleteAll(): Promise<boolean> {
    return postCollection.drop();
  },
};
