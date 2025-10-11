import { UsersRepository } from "./users/infrastructure/users.repository";
import { UsersService } from "./users/application/users.service";
import { UsersController } from "./users/routes/usersController";
import { UsersQueryRepository } from "./users/infrastructure/user.query.repository";
import { SessionsRepository } from "./securityDevices/infrastructure/sessionsRepository";
import { SessionService } from "./securityDevices/domain/sessionService";
import { SessionsController } from "./securityDevices/api/controllers/sessionsController";
import { SessionQueryRepository } from "./securityDevices/infrastructure/sessionQueryRepository";
import { PostsRepository } from "./posts/infrastructure/postRepository";
import { PostsQueryRepository } from "./posts/infrastructure/postQueryRepository";
import { PostsService } from "./posts/application/post.service";
import { BlogsRepository } from "./blogs/infrastructure/blogs.repository";
import { CommentsRepository } from "./comments/infrastructure/comment.repository";
import { CommentsService } from "./comments/application/comments.service";
import { BlogsQueryRepository } from "./blogs/infrastructure/blogs.query.repository";
import { CommentsQueryRepository } from "./comments/infrastructure/commentsQueryRepository";
import { BlogsService } from "./blogs/application/blogs.service";
import {AuthService} from "./auth/application/auth.service";
import {BlogsController} from "./blogs/routes/controller/blogsController";
import {BlogsQueryController} from "./blogs/routes/controller/blogsQueryController";

//DAL
const usersRepository = new UsersRepository();

const sessionsRepository = new SessionsRepository();

const blogsRepository = new BlogsRepository();
const blogsQueryRepository = new BlogsQueryRepository();

const postsRepository = new PostsRepository();
const postsQueryRepository = new PostsQueryRepository();

const commentsRepository = new CommentsRepository();
const commentsQueryRepository = new CommentsQueryRepository();

//BLL
const usersService = new UsersService(usersRepository);
const sessionsService = new SessionService(sessionsRepository);
const blogsService = new BlogsService(blogsRepository);
const postsService = new PostsService(postsRepository, blogsRepository);
const commentsService = new CommentsService(
  commentsRepository,
  postsRepository,
  usersRepository,
);
const authService = new AuthService(usersRepository, sessionsRepository)

//API
const usersController = new UsersController(usersService);
const sessionsController = new SessionsController(sessionsService);
const blogsController = new BlogsController(blogsService, postsService)
const blogsQueryController= new  BlogsQueryController(blogsQueryRepository);
