import { WithId } from "mongodb";
import { PostInputDto, PostType, PostViewModel } from "../types/posts-types";
import { postRepository } from "../repositories/postRepository";
import { PostQueryInput } from "../input/post-query.input";
import { blogsRepository } from "../../blogs/repositories/blogs.repository";

export const postsService = {
  async findMany(
    queryDto: PostQueryInput,
  ): Promise<{ items: WithId<PostType>[]; totalCount: number }> {
    return postRepository.findAll(queryDto);
  },

  async findByIdOrFail(id: string): Promise<PostViewModel | null> {
    return postRepository.findById(id);
  },

  async create(dto: PostInputDto): Promise<PostViewModel> {
    const foundBlog = await blogsRepository.findById(dto.blogId);

    if (!foundBlog) {
      throw new Error("blog not found");
    }
    const newPost: PostType = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: foundBlog.name,
      createdAt: new Date().toISOString(),
    };

    return postRepository.create(newPost);
  },

  async update(id: string, dto: PostInputDto): Promise<void> {
    postRepository.update(id, dto);
    return;
  },

  async delete(id: string): Promise<void> {
    postRepository.delete(id);
    return;
  },

  async deleteAll(): Promise<void> {
    postRepository.deleteAll();
    return;
  },
};
