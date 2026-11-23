import { IsString, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @Matches(/\S/, { message: 'username must not be blank' })
  username!: string;

  @IsString()
  @Matches(/\S/, { message: 'password must not be blank' })
  @MinLength(8)
  password!: string;
}
