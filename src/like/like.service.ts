import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(readonly prismaService: PrismaService) {}

  async create(createLikeDto: CreateLikeDto, userId: string) {
    const { postId } = createLikeDto;
    const post = await this.prismaService.post.findUnique({
      where: { postId },
    });
    if (!post) throw new NotFoundException('Post not found');
    await this.prismaService.like.create({
      data: {
        postId,
        userId,
      },
    });
    return { data: 'The post is liked' };
  }

  async remove(likeId: string, userId: string) {
    const like = await this.prismaService.like.findFirst({ where: { likeId } });
    if (!like) throw new NotFoundException('Like not found');

    if (like.userId !== userId)
      throw new ForbiddenException('Access to resources denied');
    await this.prismaService.like.delete({ where: { likeId } });
    return { date: 'The message is unlike' };
  }
}
