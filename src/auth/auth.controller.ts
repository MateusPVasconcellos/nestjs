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

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @IsPublic()
  signin(@Request() req: AuthRequest) {
    return this.authService.signin(req.user);
  }

  @Post('signup')
  signup(@Request() req: AuthRequest) {
    return this.authService.signup(req.user);
  }

  @Post('logout')
  logout(@Request() req: AuthRequest) {
    return this.authService.logout(req.user);
  }

  @Post('refresh')
  refresh(@Request() req: AuthRequest) {
    return this.authService.refresh(req.user);
  }

  @Get('/me')
  getMe(@CurrentUser() user: User) {
    return user;
  }
}
