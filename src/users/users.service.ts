/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';

import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/mailer/mailer.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, email, password } = createUserDto;
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (user) throw new ConflictException('User already exists');
    const hash = await bcrypt.hash(password, 10);
    const createdUser = await this.prismaService.user.create({
      data: {
        email,
        username,
        password: hash,
      },
    });
    // await this.mailerService.sendCreateAccountConfirmation(email);
    const { password: _, ...userData } = createdUser;
    return { data: userData };
  }

  async findOne(id: string) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const { password, ...result } = user;
    return { data: result };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (user.id !== id) throw new ForbiddenException('Forbidden');
    await this.prismaService.user.update({
      where: { id },
      data: { ...updateUserDto },
    });
    return { data: 'User updated' };
  }

  async delete(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException('User not found');
    return { data: 'User successfully deleted' };
  }

  async resetPasswordOnDemand(updateUserDto: UpdateUserDto) {
    const { email } = updateUserDto;
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) throw new NotFoundException('User not found');

    const code = speakeasy.totp({
      secret: this.configService.get('OTP_CODE'),
      digits: 5,
      step: 60 * 15,
      encoding: 'base32',
    });
    const url = this.configService.get('RESET_PASSWORD_URL');
    await this.mailerService.resetPassword(email, url, code);
    return { data: 'Reset password email has been sent' };
  }

  async getCurrentUser(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
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
            likeId: true,
          },
        },
        Post: {},
      },
    });
    if (!user) throw new NotFoundException('User not found');
    const { password, ...result } = user;
    return { data: result };
  }
}
