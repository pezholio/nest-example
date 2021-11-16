import {
  Controller,
  Get,
  Render,
  Param,
  Post,
  Body,
  UseFilters,
  Redirect,
} from '@nestjs/common';
import { BlogPostsService } from './blog-posts.service';
import { CreateBlogPostDto } from './interfaces/create-blog-post.dto';

import { ValidationExceptionFilter } from '../validation/validation-exception-filter';
@Controller('blog-posts')
export class BlogPostsController {
  constructor(private blogPostsService: BlogPostsService) {}

  @Get()
  @Render('blog-posts/index')
  async findAll(): Promise<any> {
    const blogPosts = await this.blogPostsService.findAll();

    return { blogPosts: blogPosts };
  }

  @Get('new')
  @Render('blog-posts/new')
  async new() {
    // do nothing.
  }

  @Get(':postID')
  @Render('blog-posts/show')
  async show(@Param('postID') postID) {
    const blogPost = await this.blogPostsService.findOne(postID);

    return { blogPost: blogPost };
  }

  @Get(':postID/edit')
  @Render('blog-posts/edit')
  async edit(@Param('postID') postID) {
    const blogPost = await this.blogPostsService.findOne(postID);

    return { blogPost: blogPost };
  }

  @Post(':postID')
  @UseFilters(new ValidationExceptionFilter('blog-posts/edit', 'blogPost'))
  @Redirect('/blog-posts', 301)
  async update(
    @Param('id') postID: string,
    @Body() createBlogPostDto: CreateBlogPostDto,
  ) {
    return await this.blogPostsService.update(postID, createBlogPostDto);
  }

  @Post()
  @UseFilters(new ValidationExceptionFilter('blog-posts/new', 'blogPost'))
  @Redirect('/blog-posts', 301)
  async create(@Body() createBlogPostDto: CreateBlogPostDto) {
    return await this.blogPostsService.create(createBlogPostDto);
  }
}
