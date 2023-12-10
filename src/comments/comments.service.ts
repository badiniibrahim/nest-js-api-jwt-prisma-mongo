import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(readonly prismaService: PrismaService) {}

  async create(createCommentDto: CreateCommentDto, userId: string) {
    const { content, postId } = createCommentDto;
    const post = await this.prismaService.post.findUnique({
      where: { postId },
    });
    if (!post) throw new NotFoundException('Post not found');

    await this.prismaService.comment.create({
      data: { content, userId, postId },
    });
    return { data: 'Comment created' };
  }

  async update(
    commentId: string,
    updateCommentDto: UpdateCommentDto,
    userId: string,
  ) {
    const { postId } = updateCommentDto;

    const comment = await this.prismaService.comment.findUnique({
      where: { commentId },
    });
    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.postId !== postId)
      throw new UnauthorizedException('Post id does not match');

    if (comment.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    await this.prismaService.comment.update({
      where: { commentId },
      data: { ...updateCommentDto },
    });
    return { data: 'Comment updated' };
  }

  async remove(commentId: string, userId: string) {
    const comment = await this.prismaService.comment.findFirst({
      where: { commentId },
    });
    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    await this.prismaService.comment.delete({ where: { commentId } });
    return { date: 'Comment deleted' };
  }
}
