
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BlogPost } from './blog-post.entity';

@Injectable()
export class BlogPostsService {
  constructor(
    @InjectRepository(BlogPost)
    private blogPostsRepository: Repository<BlogPost>,
  ) {}

  findAll(): Promise<BlogPost[]> {
    return this.blogPostsRepository.find();
  }

  findOne(id: string): Promise<BlogPost> {
    return this.blogPostsRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.blogPostsRepository.delete(id);
  }
}
