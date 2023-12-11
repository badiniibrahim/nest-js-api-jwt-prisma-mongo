import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';

@Injectable()
export class PostsService {
  constructor(
    readonly prismaService: PrismaService,
    private awsS3Service: AwsS3Service,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    userId: string,
    file: Express.Multer.File,
  ) {
    const { title, content } = createPostDto;
    const bucketKey = `${file.fieldname}${Date.now()}`;
    const fileUrl = await this.awsS3Service.uploadFile(file, bucketKey);
    await this.prismaService.post.create({
      data: {
        title,
        content,
        userId,
        imageUrl: fileUrl,
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
