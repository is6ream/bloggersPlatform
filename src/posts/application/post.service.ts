import { Result } from "../../core/result/result.type";
import { PostByIdInputDto } from "../types/posts-types";
import { PostInputDto } from "../types/posts-types";
import { PostsRepository } from "../infrastructure/postRepository";
import { BlogsRepository } from "../../blogs/infrastructure/blogs.repository";
import {
  handleBadRequestResult,
  handleNotFoundResult,
  handleSuccessResult,
  handleUnauthorizedFResult,
} from "../../core/result/handleResult";
import { inject, injectable } from "inversify";
import { PostDocument, PostModel } from "../types/postMongoose";
import { PostLikeStatusDto } from "../../likes/likeStatusType";
import { LikeModel, LikeStatus } from "../../likes/likesMongoose";
import { ObjectId } from "mongodb";
import { UserModel } from "../../users/types/usersMongoose";

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

  async updateLikeForPostStatus(
    //сейчас нужно записывать три последних лайка в коллекцию  постов
    dto: PostLikeStatusDto,
  ): Promise<Result<null | void>> {
    let user = await UserModel.findOne({
      _id: new ObjectId(dto.userId),
    });
    if (!user) {
      return handleUnauthorizedFResult("user not found", "userId");
    }
    let like = await LikeModel.findOne({
      //ищем лайк по полям из dto
      userId: dto.userId,
      parentId: dto.postId,
    });
    let post = await PostModel.findOne({ _id: new ObjectId(dto.postId) }); //аналогично с постом
    if (!post) {
      return handleNotFoundResult("Post not found", "postId");
    }
    if (!like) {
      //если нет лайка, создаем новый
      like = new LikeModel();
      like.status = dto.status;
      like.userId = dto.userId;
      like.userLogin = user.login;
      like.parentId = dto.postId;
      like.parentType = "Post";
      await this.likesForPostCount(post, "None" as LikeStatus, like.status); //обновляем счетчик
      await this.postRepository.likeStatusSave(like);
      return handleSuccessResult();
    }
    if (like.status === dto.status) {
      //если статус найденного лайка равен данным из дто, ничего не делаем
      return handleSuccessResult();
    }
    let oldLikeStatus = like.status; //в противном случае сохраняем старый статус
    like.status = dto.status; //приписываем новый статус
    like.createdAt = new Date(); //обновляем поле createdAt
    await this.likesForPostCount(post, oldLikeStatus, dto.status); //инкрементируем счетчик согласно статусу
    await this.postRepository.likeStatusSave(like);
    return handleSuccessResult();
  }
  private async likesForPostCount(
    post: PostDocument,
    oldLikeStatus: LikeStatus,
    newLikeStatus: LikeStatus,
  ) {
    if (oldLikeStatus === "Like" && newLikeStatus === "Dislike") {
      post.likesInfo.likesCount--;
      post.likesInfo.dislikesCount++;
      await this.postRepository.save(post);
      return;
    }
    if (oldLikeStatus === "Like" && newLikeStatus === "None") {
      post.likesInfo.likesCount--;
      await this.postRepository.save(post);
      return;
    }
    if (oldLikeStatus === "Dislike" && newLikeStatus === "Like") {
      post.likesInfo.likesCount++;
      post.likesInfo.dislikesCount--;
      await this.postRepository.save(post);
      return;
    }
    if (oldLikeStatus === "Dislike" && newLikeStatus === "None") {
      post.likesInfo.dislikesCount--;
      await this.postRepository.save(post);
      return;
    }
    if (oldLikeStatus === "None" && newLikeStatus === "Like") {
      post.likesInfo.likesCount++;
      await this.postRepository.save(post);
      return;
    }
    if (oldLikeStatus === "None" && newLikeStatus === "Dislike") {
      post.likesInfo.dislikesCount++;
      await this.postRepository.save(post);
      return;
    }
  }
}
