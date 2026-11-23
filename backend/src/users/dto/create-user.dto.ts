import { IsEnum, IsString, Matches, MinLength } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @Matches(/\S/, { message: 'username must not be blank' })
  username!: string;

  @IsString()
  @Matches(/\S/, { message: 'password must not be blank' })
  @MinLength(8)
  password!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}
