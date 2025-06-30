import { body } from 'express-validator';
import { Request, Response } from "express";
import { log } from 'console';


export const usersService = {
  async create(dto: any): Promise<string> {
    const { login, password, email } = dto;
    const passwordHash = await bcryptService.generateHash(password);

    const newUser = {
      login,
      email,
      passwordHash,
      createdAt: new Date()
    };

    const newUserId = await usersRepository.create(newUser);

    return newUserId;
  },
};


const createUserHandler = await(req: Request<any>, res: Response<any>) => {
  const {login, password, email} = req.body;

  const userId = await usersService.create({login, password, email})
  const newUser = await usersQwrRepo.findById(userId);

  return res.status(201).send(newUser!)
}
