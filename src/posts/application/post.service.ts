import { Result } from "./../../core/result/result.type";
import { PostByIdInputDto } from "./../types/posts-types";
import { PostInputDto, PostViewModel } from "../types/posts-types";
import { postRepository } from "../repositories/postRepository";
import { blogQueryRepository } from "../../blogs/repositories/blogs.query.repository";
import { ResultStatus } from "../../core/result/resultCode";

export const postsService = {
  async create(dto: PostInputDto): Promise<Result<string>> {
    const foundBlog = await blogQueryRepository.findById(dto.blogId);

    if (!foundBlog) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "Not found",
        extensions: [{ field: null, message: "Blog not found" }],
      };
    }
    const postId = await postRepository.create({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: foundBlog.name,
      createdAt: new Date(),
    });

    return {
      status: ResultStatus.Success,
      data: postId,
      extensions: [],
    };
  },

  async createPostByBlogId(
    blogId: string,
    dto: PostByIdInputDto
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

  async delete(id: string): Promise<boolean> {
    return await postRepository.delete(id);
  },
};
