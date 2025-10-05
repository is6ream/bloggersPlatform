import { PostDB } from "../types/posts-types";
import { PostInputDto } from "../types/posts-types";
import { ObjectId } from "mongodb";
import { postCollection } from "../../db/mongo.db";
import { WithId } from "mongodb";

class PostRepository {
  async create(newPost: PostDB): Promise<string> {
    const insertResult = await postCollection.insertOne(newPost);
    const insertedId = insertResult.insertedId;
    return insertedId.toString();
  }

  async createPostByBlogId(newPost: PostDB): Promise<string> {
    const insertResult = await postCollection.insertOne(newPost);
    const insertedId = insertResult.insertedId;
    return insertedId.toString();
  }

  async findPost(id: string): Promise<WithId<PostDB> | null> {
    return await postCollection.findOne({ _id: new ObjectId(id) });
  }

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
      },
    );
    return updateResult.modifiedCount === 1;
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await postCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  }
}
export const postRepository = new PostRepository();
