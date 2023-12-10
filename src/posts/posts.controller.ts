import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() createPostDto: CreatePostDto, @Req() request: Request) {
    const user = request['user'];
    return this.postsService.create(createPostDto, user['id']);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() request: Request) {
    const user = request['user'];
    return this.postsService.findAll(user['id']);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':postId')
  findOne(@Param('postId') id: string) {
    return this.postsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:postId')
  update(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() request: Request,
  ) {
    const user = request['user'];
    return this.postsService.update(postId, updatePostDto, user['id']);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:postId')
  remove(@Param('postId') postId: string, @Req() request: Request) {
    const user = request['user'];
    return this.postsService.remove(postId, user['id']);
  }
}
