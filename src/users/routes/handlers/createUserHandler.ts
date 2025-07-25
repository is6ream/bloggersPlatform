import { Request, Response } from "express";
import { usersService } from "../../application/users.service";
import { usersQueryRepository } from "../../repositories/user.query.repository";
import { HttpStatus } from "../../../core/http-statuses";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";

export async function createUserHandler(req: Request, res: Response) {
  try {
    const result = await usersService.create(req.body);
    if (result.status !== ResultStatus.Success) {
      res
        .status(resultCodeToHttpException(result.status))
        .send(result.extensions);
      return;
    }
    const newUser = await usersQueryRepository.findById(result.data!);
    res.status(HttpStatus.Created).send(newUser!);
  } catch (err: unknown) {
    console.log(err);
    res.status(400).send(err);
  }
}

//globalErrorHandler принцип работы изучить
