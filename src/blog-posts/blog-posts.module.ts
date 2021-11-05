
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlogPost } from './blog-post.entity';
import { BlogPostsService } from './blog-posts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogPost])
  ],
  providers: [
    BlogPostsService
  ],
  controllers: [
  ],
})
export class BlogPostsModule {}
