import { AppError } from '../Error/AppError';
import { prisma } from './../lib/prisma';
import { Request, Response } from 'express';
import Zod from 'zod';
import { hash } from 'bcrypt';
import { excludeFields } from '../utils/excludeFields';

export class UserController {
  /*List */
  public async list(_request: Request, response: Response) {
    const users = await prisma.user.findMany();

    const usersWithoutPassword = users.map((user) => {
      return excludeFields(user, ['password_hash']);
    });

    return response.status(200).json(usersWithoutPassword);
  }
  /* Show */
  public async show(request: Request, response: Response) {
    const { id } = request.params;

    const users = await prisma.user.findUnique({
      where: { id },
    });

    if (!users) {
      throw new AppError('User not found', 404);
    }

    return response.status(200).json(excludeFields(users, ['password_hash']));
  }
  /* Create */
  public async create(request: Request, response: Response) {
    const bodySchema = Zod.object({
      name: Zod.string().min(3),
      email: Zod.string().email(),
      password: Zod.string().min(6),
    }).strict();

    const { name, email, password } = bodySchema.parse(request.body);

    const usersExist = await prisma.user.findFirst({
      where: { email },
    });

    if (usersExist) {
      throw new AppError('User already registered', 409);
    }

    const password_hash = await hash(password, 6);

    const users = await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
      },
    });

    return response.status(200).json(excludeFields(users, ['password_hash']));
  }
  /* Update */
  public async update(request: Request, response: Response) {
    const bodySchema = Zod.object({
      name: Zod.string().min(3).nullish(),
      email: Zod.string().email().nullish(),
    }).strict();

    const { name, email } = bodySchema.parse(request.body);
    const { id } = request.params;

    const userExists = await prisma.user.findUnique({
      where: { id },
    });

    if (!userExists) throw new AppError('User not found', 404);

    let data = {};

    if (name) data = { name };
    if (email) data = { ...data, email };

    const users = await prisma.user.update({
      where: { id },
      data,
    });

    return response.status(200).json(users);
  }
  /* Delete */
  public async delete(request: Request, response: Response) {
    const { id } = request.params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const users = await prisma.user.delete({
      where: { id },
    });

    return response.status(204).json();
  }
}
