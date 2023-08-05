import { Exclude, instanceToPlain } from 'class-transformer';
import { IsNotEmpty, Length } from 'class-validator';
import { Match } from 'src/shared/decorators/match-decorator';

export class RecoveryPasswordDto {
  @IsNotEmpty()
  @Length(5, 50)
  @Exclude({ toPlainOnly: true })
  password: string;

  @Match('password')
  @Exclude({ toPlainOnly: true })
  password_confirmation: string;

  toJSON() {
    return instanceToPlain(this);
  }
}
