import { Request, Response } from "express";
import { CreateUserDto } from "../../input/create-user-dto";
import { UserViewModel } from "../../types/user-types";
import { usersService } from "../../application/users.service";
import { usersQueryRepository } from "../../repositories/user.query.repository";
import { HttpStatus } from "../../../core/http-statuses";

async (req: Request<CreateUserDto>, res: Response<UserViewModel>) => {
  const { login, password, email } = req.body;

  const userId = await usersService.create({ login, password, email });
  const newUser = await usersQueryRepository.findById(userId);

  return res.status(HttpStatus.Created).send(newUser!);
};
