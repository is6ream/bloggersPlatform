import { PostDB, PostViewModel } from "../types/posts-types";
import { PostInputDto } from "../types/posts-types";
import { ObjectId } from "mongodb";
import { postCollection } from "../../db/mongo.db";
import { WithId } from "mongodb";
import { injectable } from "inversify";
import { PostDocument, PostModel } from "../types/postMongoose";

@injectable()
export class PostsRepository {
  async create(post: PostDocument): Promise<string> {
    await post.save();
    return post._id.toString();
  }

  async findPost(id: string): Promise<WithId<PostDB> | null> {
    return PostModel.findOne({ _id: new ObjectId(id) }).lean();
  }

  async findById(id: string): Promise<PostViewModel | null> {
    //ранее возвращался objectResult, сейчас переделал на примитивы, упало много ошибок
    const post = await PostModel.findOne({ _id: new ObjectId(id) }).lean();
    if (!post) {
      return null;
    }
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    };
  }

  async update(post: PostDocument): Promise<boolean> {
    await post.save();
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await PostModel.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  }
}
