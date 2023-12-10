import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsString } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsString()
  readonly title?: string;

  @IsString()
  readonly content?: string;
}
