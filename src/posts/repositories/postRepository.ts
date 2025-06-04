import { PostType } from "../types/posts-types";
import { PostInputDto } from "../types/posts-types";
import { ObjectId, WithId } from "mongodb";
import { postCollection } from "../../db/mongo.db";

export const postRepository = {
  async findAll(): Promise<WithId<PostType>[]> {
    return postCollection.find().toArray();
  },

  findById(id: string): Promise<WithId<PostType> | null> {
    return postCollection.findOne({ _id: new ObjectId(id) });
  },

  create(newPost: PostType) {
    db.posts.push(newPost);
    return newPost;
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
