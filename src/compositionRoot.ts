import { UsersRepository } from "./users/infrastructure/users.repository";
import { UsersService } from "./users/application/users.service";
import { UsersController } from "./users/routes/usersController";
import { UsersQueryController } from "./users/routes/usersQueryController";
import { UsersQueryRepository } from "./users/infrastructure/user.query.repository";
import { SessionsRepository } from "./securityDevices/infrastructure/sessionsRepository";
import { SessionService } from "./securityDevices/domain/sessionService";
import { SessionsController } from "./securityDevices/api/controllers/sessionsController";
import { SessionsQueryController } from "./securityDevices/api/controllers/sessionsQueryController";
import { SessionQueryRepository } from "./securityDevices/infrastructure/sessionQueryRepository";

//for users
const usersRepository = new UsersRepository();
const usersQueryRepository = new UsersQueryRepository();
const usersService = new UsersService(usersRepository);
export const usersController = new UsersController(usersService);
export const usersQueryController = new UsersQueryController(
  usersQueryRepository,
);

//for sessions
const sessionsRepository = new SessionsRepository();
const sessionsQueryRepository = new SessionQueryRepository();
const sessionsService = new SessionService(sessionsRepository);
const sessionsController = new SessionsController(sessionsService);
const sessionsQueryController = new SessionsQueryController(
  sessionsQueryRepository,
);
