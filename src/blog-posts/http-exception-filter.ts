import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { CreateBlogPostDto } from './interfaces/create-blog-post.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const blogPost = Object.assign(new CreateBlogPostDto(), request.body);
    const validationErrors = await validate(blogPost);
    const errors = {};
    const errorMessages = [];

    validationErrors.forEach((error) => {
      errors[error.property] = {
        text: Object.values(error.constraints).join(),
      };
      errorMessages.push({
        text: Object.values(error.constraints).join(),
        href: `#${error.property}`,
      });
    });

    response.render('blog-posts/new', {
      errors: errors,
      errorMessages: errorMessages,
      blogPost: blogPost,
    });
  }
}
