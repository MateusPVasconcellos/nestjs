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
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './decorators/current-user.decoretor';
import { User } from 'src/users/domain/entities/user.entity';
import { AuthRequestDto } from './dto/auth-request.dto';
import { IsPublic } from './decorators/is-public.decoretor';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @IsPublic()
  signin(@Request() req: AuthRequestDto) {
    return this.authService.signin(req.user);
  }

  @Post('signup')
  signup(@Request() req: AuthRequestDto) {
    return this.authService.signup(req.user);
  }

  @Get('logout')
  logout(@Request() req: AuthRequestDto) {
    return this.authService.logout(req.user);
  }

  @IsPublic()
  @Get('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  refresh(@Request() req: AuthRequestDto) {
    return this.authService.refresh(req.user);
  }

  @Get('/me')
  getMe(@CurrentUser() user: User) {
    return user;
  }
}
