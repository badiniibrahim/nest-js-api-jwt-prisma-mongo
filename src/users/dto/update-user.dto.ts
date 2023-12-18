import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  readonly username?: string;

  @IsEmail()
  readonly email?: string;

  @IsString()
  readonly password?: string;

  @IsString()
  readonly bio?: string;

  @IsString()
  readonly imageUrl?: string;
}
