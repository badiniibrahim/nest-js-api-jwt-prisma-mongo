import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() createLikeDto: CreateLikeDto, @Req() request: Request) {
    const user = request['user'];
    return this.likeService.create(createLikeDto, user['id']);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  remove(@Param('id') likeId: string, @Req() request: Request) {
    const user = request['user'];
    return this.likeService.remove(likeId, user['id']);
  }
}
