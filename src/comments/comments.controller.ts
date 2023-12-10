import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('create')
  create(@Body() createCommentDto: CreateCommentDto, @Req() request: Request) {
    const user = request['user'];
    return this.commentsService.create(createCommentDto, user['id']);
  }

  @Patch('update/:id')
  update(
    @Param('id') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() request: Request,
  ) {
    const user = request['user'];
    return this.commentsService.update(commentId, updateCommentDto, user['id']);
  }

  @Delete('delete/:id')
  remove(@Param('id') commentId: string, @Req() request: Request) {
    const user = request['user'];
    return this.commentsService.remove(commentId, user['id']);
  }
}
