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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Request, Express } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('create')
  create(
    @Body() createPostDto: CreatePostDto,
    @Req() request: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user = request['user'];
    return this.postsService.create(createPostDto, user['id'], file);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() request: Request) {
    const user = request['user'];
    return this.postsService.findAll(user['id']);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  findAllPost() {
    return this.postsService.findAllPost();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':postId')
  findOne(@Param('postId') id: string) {
    return this.postsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  getUserPosts(@Param('userId') id: string) {
    return this.postsService.getUserPosts(id);
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
