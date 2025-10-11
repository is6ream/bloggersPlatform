import { PostDB, PostViewModel } from "../types/posts-types";
import { PostInputDto } from "../types/posts-types";
import { ObjectId } from "mongodb";
import { postCollection } from "../../db/mongo.db";
import { WithId } from "mongodb";
import { Result } from "../../core/result/result.type";
import {
  handleNotFoundResult,
  handleSuccessResult,
} from "../../core/result/handleResult";

export class PostsRepository {
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

  async findById(id: string): Promise<Result<PostViewModel | null>> {
    const post = await postCollection.findOne({ _id: new ObjectId(id) });

    if (!post) {
      return handleNotFoundResult("post not found", "postId");
    }
    const data = {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    };
    return handleSuccessResult(data);
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
