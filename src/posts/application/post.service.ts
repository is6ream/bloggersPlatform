import { Result } from "../../core/result/result.type";
import { PostByIdInputDto } from "../types/posts-types";
import { PostInputDto } from "../types/posts-types";
import { PostsRepository } from "../infrastructure/postRepository";
import { BlogsRepository } from "../../blogs/infrastructure/blogs.repository";
import {
  handleBadRequestResult,
  handleNotFoundResult,
  handleSuccessResult,
} from "../../core/result/handleResult";
import { inject, injectable } from "inversify";
import { PostModel } from "../types/postMongoose";
import {LikeStatusDto} from "../../comments/likes/likeStatusType";

@injectable()
export class PostsService {
  constructor(
    @inject(PostsRepository) private postRepository: PostsRepository,
    @inject(BlogsRepository) private blogsRepository: BlogsRepository,
  ) {}

  async create(dto: PostInputDto): Promise<Result<string>> {
    const foundBlog = await this.blogsRepository.findById(dto.blogId);
    if (!foundBlog) {
      return handleBadRequestResult("blog not found", "blogId");
    }
    const newPost = new PostModel();
    newPost.title = dto.title;
    newPost.shortDescription = dto.shortDescription;
    newPost.content = dto.content;
    newPost.blogId = foundBlog.id;
    newPost.blogName = foundBlog.name;
    const newPostId = await this.postRepository.create(newPost);
    return handleSuccessResult(newPostId);
  }

  async createPostByBlogId(
    blogId: string,
    dto: PostByIdInputDto,
  ): Promise<Result<string>> {
    const blog = await this.blogsRepository.findById(blogId);
    if (!blog) {
      return handleBadRequestResult("blog not found", "blogId");
    }
    const newPost = new PostModel();
    newPost.title = dto.title;
    newPost.shortDescription = dto.shortDescription;
    newPost.content = dto.content;
    newPost.blogId = blogId;
    newPost.blogName = blog.name;
    const newPostId = await this.postRepository.create(newPost);
    return handleSuccessResult(newPostId);
  }

  async update(id: string, dto: PostInputDto): Promise<Result> {
    const post = await PostModel.findById(id);
    if (!post) {
      return handleNotFoundResult("Post not found", "postId");
    }
    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = dto.blogId;

    await this.postRepository.update(post);
    return handleSuccessResult();
  }

  async delete(id: string): Promise<Result> {
    const post = await PostModel.findById(id);
    if (!post) {
      return handleNotFoundResult("Post not found", "postId");
    }
    await this.postRepository.delete(id);
    return handleSuccessResult();
  }

  async updateLikeForPostStatus(dto: LikeStatusDto): Promise<Result> {
      let like = await LikeModel.findOne({
          userId: dto.userId,
          parentId: dto.
      })
  }
}
