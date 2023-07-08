import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRequest } from './models/auth-request.model';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { IsPublic } from './decorators/is-public.decoretor';
import { CurrentUser } from './decorators/current-user.decoretor';
import { User } from 'src/users/domain/entities/user.entity';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @IsPublic()
  login(@Request() req: AuthRequest) {
    return this.authService.login(req.user);
  }

  @Get('/me')
  getMe(@CurrentUser() user: User) {
    return user;
  }
}
