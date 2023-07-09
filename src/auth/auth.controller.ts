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
import { IsPublic } from './decorators/is-public.decoretor';
import { CurrentUser } from './decorators/current-user.decoretor';
import { User } from 'src/users/domain/entities/user.entity';
import { AuthRequestDto } from './dto/auth-request.dto';

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

  @Post('logout')
  logout(@Request() req: AuthRequestDto) {
    return this.authService.logout(req.user);
  }

  @Post('refresh')
  refresh(@Request() req: AuthRequestDto) {
    return this.authService.refresh(req.user);
  }

  @Get('/me')
  getMe(@CurrentUser() user: User) {
    return user;
  }
}
