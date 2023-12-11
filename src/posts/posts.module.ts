import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { AwsS3Module } from 'src/aws-s3/aws-s3.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [AwsS3Module],
})
export class PostsModule {}
