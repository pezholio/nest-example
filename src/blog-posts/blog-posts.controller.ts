import { Controller, Get, Render, Param } from '@nestjs/common';
import { BlogPostsService } from './blog-posts.service'

@Controller('blog-posts')
export class BlogPostsController {
  constructor(private blogPostsService: BlogPostsService) {}

  @Get()
  @Render('blog-posts/index')
  async findAll(): Promise<any> {
    const blogPosts = await this.blogPostsService.findAll()

    return { blogPosts: blogPosts }
  }

  @Get(':postID')
  @Render('blog-posts/show')
  async getCourse(@Param('postID') postID) {
    const blogPost = await this.blogPostsService.findOne(postID)

    return { blogPost: blogPost };
  }
}
