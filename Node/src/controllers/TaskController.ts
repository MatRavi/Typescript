import { AppError } from '../Error/AppError';
import { prisma } from './../lib/prisma';
import { Request, Response } from 'express';
import Zod from 'zod';
import { hash } from 'bcrypt';
import { excludeFields } from '../utils/excludeFields';

export class TaskController {
  /*List */
  public async list(_request: Request, response: Response) {
    const tasks = await prisma.task.findMany();

    return response.status(200).json(tasks);
  }
  /* Show */
  public async show(request: Request, response: Response) {
    const { id } = request.params;

    const tasks = await prisma.task.findUnique({
      where: { id },
    });

    if (!tasks) {
      throw new AppError('Task not found', 404);
    }

    return response.status(200).json(tasks);
  }
  /* Create */
  public async create(request: Request, response: Response) {
    const bodySchema = Zod.object({
      name: Zod.string().min(3),
      time: Zod.string(),
      user_id: Zod.string().min(6).uuid(),
    }).strict();

    const { name, time, user_id } = bodySchema.parse(request.body);

    const userExist = await prisma.user.findUnique({
      where: { id: user_id },
    });

    if (!userExist) {
      throw new AppError('User not found', 404);
    }

    const tasks = await prisma.task.create({
      data: {
        name,
        time,
        user_id,
      },
    });

    return response.status(200).json(tasks);
  }
  /* Update */
  public async update(request: Request, response: Response) {
    const bodySchema = Zod.object({
      name: Zod.string().min(3).nullish(),
      time: Zod.string().nullish(),
      user_id: Zod.string().min(6).uuid().nullish(),
    }).strict();

    const { name, time } = bodySchema.parse(request.body);
    const { id } = request.params;

    const taskExist = await prisma.task.findUnique({
      where: { id },
    });

    if (taskExist) {
      console.log(111);
    }
    if (!taskExist) {
      console.log(222);
      throw new AppError('User not found', 404);
    }

    let data = {};

    if (name) data = { name };
    if (time) data = { ...data, time };

    const tasks = await prisma.task.update({
      where: { id },
      data,
    });

    return response.status(200).json(tasks);
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

    const tasks = await prisma.user.delete({
      where: { id },
    });

    return response.status(204).json();
  }
}
