import { Request, Response } from "express";
import { usersService } from "../../application/users.service";
import { usersQueryRepository } from "../../repositories/user.query.repository";
import { HttpStatus } from "../../../core/http-statuses";

export async function createUserHandler(req: Request, res: Response) {
  try {
    const { login, password, email } = req.body;

    const userId = await usersService.create({ login, password, email });
    const newUser = await usersQueryRepository.findById(userId);

    res.status(HttpStatus.Created).send(newUser!);
  } catch (err: unknown) {
    console.log(err);
    res.status(400).send(err);
  }
}

//globalErrorHandler принцип работы изучить
