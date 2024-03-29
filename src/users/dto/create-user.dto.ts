import { Exclude, instanceToPlain } from 'class-transformer';
import { IsEmail, IsNotEmpty, Length, MaxLength } from 'class-validator';
import { Match } from 'src/shared/decorators/match-decorator';

export class CreateUserDto {
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @Length(5, 50)
  @Exclude({ toPlainOnly: true })
  password: string;

  @Match('password')
  @Exclude({ toPlainOnly: true })
  password_confirmation: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  email: string;

  cpf_cnpj: string;

  type_person: string;

  toJSON() {
    return instanceToPlain(this);
  }
}
