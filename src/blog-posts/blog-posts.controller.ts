import {
  Controller,
  Get,
  Render,
  Param,
  Post,
  Body,
  Redirect,
  UseFilters,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { BlogPostsService } from './blog-posts.service';
import { CreateBlogPostDto } from './interfaces/create-blog-post.dto';
import { HttpExceptionFilter } from './http-exception-filter';
import { ValidationFailedError } from '../helpers/validator';
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
  @Redirect('/blog-posts', 301)
  @UseFilters(new HttpExceptionFilter())
  async update(
    @Param('id') postID: string,
    @Body() createBlogPostDto: CreateBlogPostDto,
  ) {
    return this.blogPostsService.update(postID, createBlogPostDto);
  }

  @Post()
  async create(
    @Body() createBlogPostDto: CreateBlogPostDto,
    @Res() res: Response,
  ) {
    try {
      await this.blogPostsService.create(createBlogPostDto);
      return res.redirect(301, '/blog-posts');
    } catch (err: unknown) {
      if (err instanceof ValidationFailedError) {
        return res.render('blog-posts/new', {
          blogPost: createBlogPostDto,
          errors: err.fullMessages(),
        });
      } else {
        throw err;
      }
    }
  }
}
