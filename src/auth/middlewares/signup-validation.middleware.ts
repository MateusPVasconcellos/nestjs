import {
  BadRequestException,
  ConflictException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { validate } from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SignupValidationMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const body = req.body;
    const signupRequestBody = new CreateUserDto();
    signupRequestBody.name = body.name;
    signupRequestBody.email = body.email;
    signupRequestBody.password_confirmation = body.password_confirmation;
    signupRequestBody.password = body.password;

    const validations = await validate(signupRequestBody);

    if (validations.length) {
      throw new BadRequestException(
        validations.reduce((acc, curr) => {
          return [...acc, ...Object.values(curr.constraints)];
        }, []),
      );
    }

    const user = await this.usersService.findByEmail(signupRequestBody.email);

    if (user) {
      throw new ConflictException('There is already a user with this email.');
    }

    next();
  }
}
