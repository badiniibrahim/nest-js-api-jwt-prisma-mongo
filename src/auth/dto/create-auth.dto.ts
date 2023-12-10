import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @IsEmail()
  readonly email: string;
}
