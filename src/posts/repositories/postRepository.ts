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

  update(id: string, dto: PostInputDto): void {
    const post = db.posts.find((p) => p.id === id);

    if (!post) {
      throw new Error("Post not exist");
    }

    post.title = dto.title || post.title;
    post.shortDescription = dto.shortDescription || post.shortDescription;
    post.content = dto.content || post.content;
    post.blogId = dto.blogId || post.blogId;
    return;
  },

  delete(id: string) {
    const index = db.posts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("Post not exist");
    }
    return db.posts.splice(index, 1);
  },
};
