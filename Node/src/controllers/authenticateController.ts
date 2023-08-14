import { AppError } from '../Error/AppError';
import { prisma } from './../lib/prisma'
import { Request, Response} from "express";
import Zod from 'zod';
import {compare, hash} from "bcrypt";
import { sign } from 'jsonwebtoken';

export class authenticateController {
  /* Create */
    public async create(request: Request, response: Response){
      const bodySchema = Zod.object({
          email: Zod.string().email(),
          password: Zod.string().min(6),
      }).strict();

      const { email, password} = bodySchema.parse(request.body);

      const users = await prisma.user.findFirst({
          where: { email },
      });

      if(!users) throw new AppError('Email or password incorrect!', 401);

      const passwordMatch = await compare(password, users.password_hash);

      if(!passwordMatch) throw new AppError('Email or password incorrect!', 401);

      const token = sign({}, 'minhachavemuitosecreta',{
        subject: users.id,
        expiresIn: '1d',
      })

      return response.status(200).json({ token });
    }
}