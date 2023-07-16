import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { validate } from 'class-validator';
import { SigninDto } from '../dto/signin.dto';

@Injectable()
export class SigninValidationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const body = req.body;
    const loginRequestBody = new SigninDto();
    loginRequestBody.email = body.email;
    loginRequestBody.password = body.password;

    const validations = await validate(loginRequestBody);

    if (validations.length) {
      throw new BadRequestException(
        validations.reduce((acc, curr) => {
          return [...acc, ...Object.values(curr.constraints)];
        }, []),
      );
    }

    next();
  }
}
