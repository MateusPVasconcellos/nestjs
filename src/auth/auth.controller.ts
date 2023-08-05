import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './decorators/current-user.decoretor';
import { User } from 'src/users/domain/entities/user.entity';
import { AuthRequestDto } from './dto/auth-request.dto';
import { IsPublic } from './decorators/is-public.decoretor';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtActivateAuthGuard } from './guards/jwt-activate.guard';
import { RecoveryPasswordDto } from 'src/auth/dto/recovery-password.dto';
import { JwtRecoveryAuthGuard } from './guards/jwt-recovery.guard';

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

  @IsPublic()
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    createUserDto.password_confirmation = undefined;
    return this.authService.signup(createUserDto);
  }

  @Get('signout')
  signout(@Request() req: AuthRequestDto) {
    return this.authService.signout(req.user);
  }

  @IsPublic()
  @Get('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  refresh(@Request() req: AuthRequestDto) {
    return this.authService.refresh(req.user);
  }

  @IsPublic()
  @Get('activate')
  @UseGuards(JwtActivateAuthGuard)
  activate(@Query('token') token: string) {
    return this.authService.activate(token);
  }

  @IsPublic()
  @Get('resend-activate')
  resendActivate(@Query('email') email: string) {
    return this.authService.resendActivate(email);
  }

  @IsPublic()
  @Get('recovery-email')
  sendRecoveryEmail(@Query('email') email: string) {
    return this.authService.sendRecoveryEmail(email);
  }

  @IsPublic()
  @Post('recovery')
  @UseGuards(JwtRecoveryAuthGuard)
  recoveryPassword(
    @Body() recoveryPasswordDto: RecoveryPasswordDto,
    @Request() req: AuthRequestDto,
  ) {
    return this.authService.recoveryPassword(recoveryPasswordDto, req);
  }

  @Get('/me')
  getMe(@CurrentUser() user: User) {
    return user;
  }
}
