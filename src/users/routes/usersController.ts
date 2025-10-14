import { Request, Response } from "express";
import { UsersService } from "../application/users.service";
import { HttpStatus } from "../../core/http-statuses";
import { ResultStatus } from "../../core/result/resultCode";
import { resultCodeToHttpException } from "../../core/result/resultCodeToHttpException";
import { injectable, inject } from "inversify";

@injectable()
export class UsersController {
  constructor(@inject(UsersService) protected usersService: UsersService) {}
  async createUser(req: Request, res: Response) {
    try {
      const result = await this.usersService.create(req.body);
      if (result.status !== ResultStatus.Success) {
        res
          .status(resultCodeToHttpException(result.status))
          .send(result.extensions);
        return;
      }
      const newUser = await this.usersService.findUser(result.data!);
      res.status(HttpStatus.Created).send(newUser.data!);
    } catch (err: unknown) {
      console.log(err);
      res.status(400).send(err);
    }
  }
  async deleteUser(req: Request, res: Response) {
    try {
      const id = req.params.id;

      const result = await this.usersService.delete(id);
      if (result.status !== ResultStatus.Success) {
        res.sendStatus(HttpStatus.NotFound);
      }
      res.sendStatus(HttpStatus.NoContent);
    } catch (error: unknown) {
      console.log(error);
      res.sendStatus(HttpStatus.InternalServerError);
    }
  }
}
