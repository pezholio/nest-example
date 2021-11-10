import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlogPost } from './blog-post.entity';
import { BlogPostsService } from './blog-posts.service';
import { BlogPostsController } from './blog-posts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPost])],
  providers: [BlogPostsService],
  controllers: [BlogPostsController],
})
export class BlogPostsModule {}
