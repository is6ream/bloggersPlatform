import { WithId } from "mongodb";
import { PostInputDto, PostType, PostViewModel } from "../types/posts-types";
import { postRepository } from "../repositories/postRepository";
import { PostQueryInput } from "../input/post-query.input";
import { blogsRepository } from "../../blogs/repositories/blogs.repository";
import { PostByIdInputDto } from "../types/posts-types";
import { blogQueryRepository } from "../../blogs/repositories/blogs.query.repository";
import { postQueryRepository } from "../repositories/postQueryRepository";
export const postsService = {
  async findMany(
    queryDto: PostQueryInput,
  ): Promise<{ items: WithId<PostType>[]; totalCount: number }> {
    return postQueryRepository.findAll(queryDto);
  },
  async findByIdOrFail(id: string): Promise<PostViewModel | null> {
    return postQueryRepository.findById(id);
  },

  async getPostsByBlogId(
    blogId: string,
    queryDto: PostQueryInput,
  ): Promise<{ items: WithId<PostType>[]; totalCount: number }> {
    return postQueryRepository.findPostsByBlogId(queryDto, blogId);
  },

  async create(dto: PostInputDto): Promise<PostViewModel> {
    const foundBlog = await blogQueryRepository.findById(dto.blogId);

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

  async createPostByBlogId(
    blogId: string,
    dto: PostByIdInputDto,
  ): Promise<PostViewModel | null> {
    const blog = await blogQueryRepository.findByBlogId(blogId);
    if (!blog) {
      return null;
    }
    const newPost = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: blog.id,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };
    return postRepository.createPostByBlogId(newPost);
  },

  async update(id: string, dto: PostInputDto): Promise<void> {
    postRepository.update(id, dto);
    return;
  },

  async delete(id: string): Promise<void> {
    postRepository.delete(id);
    return;
  },
};
