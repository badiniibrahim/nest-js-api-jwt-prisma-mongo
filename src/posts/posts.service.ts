import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(readonly prismaService: PrismaService) {}

  async create(createPostDto: CreatePostDto, userId: string) {
    const { title, content } = createPostDto;
    await this.prismaService.post.create({
      data: {
        title,
        content,
        userId,
      },
    });
    return { data: 'Post created' };
  }

  async findAll(userId: string) {
    const posts = await this.prismaService.post.findMany({
      where: { userId },
      include: {
        Comment: {
          select: {
            userId: true,
            content: true,
            commentId: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
        Like: {
          select: {
            userId: true,
            postId: true,
          },
        },
      },
    });
    return posts;
  }

  async findOne(id: string) {
    const post = await this.prismaService.post.findUnique({
      where: { postId: id },
    });
    return post;
  }

  async update(postId: string, updatePostDto: UpdatePostDto, userId: string) {
    const post = await this.prismaService.post.findUnique({
      where: { postId },
    });
    if (!post) throw new NotFoundException('Post not found');
    if (post.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    await this.prismaService.post.update({
      where: { postId },
      data: { ...updatePostDto },
    });
    return { data: 'Post updated' };
  }

  async remove(postId: string, userId: string) {
    const post = await this.prismaService.post.findUnique({
      where: { postId: postId },
    });
    if (!post) throw new NotFoundException('Post not found');

    if (post.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    await this.prismaService.post.delete({ where: { postId: postId } });
    return { data: 'Post deleted' };
  }
}
