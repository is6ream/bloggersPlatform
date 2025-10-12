import { Container } from "inversify";
import { UsersController } from "./users/routes/usersController";
import { UsersService } from "./users/application/users.service";
import { UsersRepository } from "./users/infrastructure/users.repository";

export const container = new Container();

container.bind(UsersController).to(UsersController);
container.bind(UsersService).to(UsersService);
container.bind(UsersRepository).to(UsersRepository);
