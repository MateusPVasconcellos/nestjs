import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Match } from 'src/shared/match-decorator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(5, 50)
  name: string;

  @IsNotEmpty()
  @Length(5, 50)
  password: string;

  @Match('password')
  password_confirmation: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
