import { UsersRepository } from "./users/infrastructure/users.repository";
import { UsersService } from "./users/application/users.service";
import { UsersController } from "./users/routes/usersController";
import { UsersQueryController } from "./users/routes/usersQueryController";
import { usersQueryRepository } from "./users/infrastructure/user.query.repository";

const usersRepository = new UsersRepository();
const usersService = new UsersService(usersRepository);
export const usersController = new UsersController(usersService);
export const usersQueryController = new UsersQueryController(
  usersQueryRepository,
);
