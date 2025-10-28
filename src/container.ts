import { Container } from "inversify";
import { UsersController } from "./users/routes/usersController";
import { UsersService } from "./users/domain/users.service";
import { UsersRepository } from "./users/infrastructure/users.repository";
import { SessionsController } from "./securityDevices/api/controllers/sessionsController";
import { UsersQueryController } from "./users/routes/usersQueryController";
import { SessionsQueryController } from "./securityDevices/api/controllers/sessionsQueryController";
import { SessionService } from "./securityDevices/domain/sessionService";
import { UsersQueryRepository } from "./users/infrastructure/user.query.repository";
import { SessionQueryRepository } from "./securityDevices/infrastructure/sessionQueryRepository";
import { SessionsRepository } from "./securityDevices/infrastructure/sessionsRepository";
import { PostsController } from "./posts/api/postsController";
import { PostsQueryRepository } from "./posts/infrastructure/postQueryRepository";
import { PostsQueryController } from "./posts/api/postsQueryController";
import { PostsService } from "./posts/application/post.service";
import { PostsRepository } from "./posts/infrastructure/postRepository";
import { BlogsController } from "./blogs/routes/controller/blogsController";
import { BlogsQueryController } from "./blogs/routes/controller/blogsQueryController";
import { BlogsService } from "./blogs/application/blogs.service";
import { BlogsRepository } from "./blogs/infrastructure/blogs.repository";
import { BlogsQueryRepository } from "./blogs/infrastructure/blogs.query.repository";
import { CommentsController } from "./comments/controller/commentsController";
import { CommentsQueryController } from "./comments/controller/commentsQueryController";
import { CommentsService } from "./comments/application/comments.service";
import { CommentsRepository } from "./comments/infrastructure/comment.repository";
import { CommentsQueryRepository } from "./comments/infrastructure/commentsQueryRepository";
import { AuthService } from "./auth/application/auth.service";
import { AuthUserController } from "./auth/api/controllers/auth.userController";
import { AuthUserQueryController } from "./auth/api/controllers/auth.userQueryController";
import "reflect-metadata";

export const container = new Container();
//for users
container.bind(UsersController).to(UsersController);
container.bind(UsersQueryController).to(UsersQueryController);
container.bind(UsersService).to(UsersService);
container.bind(UsersRepository).to(UsersRepository);
container.bind(UsersQueryRepository).to(UsersQueryRepository);

//for sessions
container.bind(SessionsController).to(SessionsController);
container.bind(SessionsQueryController).to(SessionsQueryController);
container.bind(SessionService).to(SessionService);
container.bind(SessionQueryRepository).to(SessionQueryRepository);
container.bind(SessionsRepository).to(SessionsRepository);

//for posts
container.bind(PostsController).to(PostsController);
container.bind(PostsQueryController).to(PostsQueryController);
container.bind(PostsService).to(PostsService);
container.bind(PostsQueryRepository).to(PostsQueryRepository);
container.bind(PostsRepository).to(PostsRepository);

//for blogs
container.bind(BlogsController).to(BlogsController);
container.bind(BlogsQueryController).to(BlogsQueryController);
container.bind(BlogsService).to(BlogsService);
container.bind(BlogsRepository).to(BlogsRepository);
container.bind(BlogsQueryRepository).to(BlogsQueryRepository);

//for comments
container.bind(CommentsController).to(CommentsController);
container.bind(CommentsQueryController).to(CommentsQueryController);
container.bind(CommentsService).to(CommentsService);
container.bind(CommentsRepository).to(CommentsRepository);
container.bind(CommentsQueryRepository).to(CommentsQueryRepository);

//for auth
container.bind(AuthService).to(AuthService);
container.bind(AuthUserController).to(AuthUserController);
container.bind(AuthUserQueryController).to(AuthUserQueryController);
