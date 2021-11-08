
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const exceptionResponse = exception.getResponse()
    const errors = exceptionResponse["message"].map(message => {
      return {
        text: message,
        href: "#"
      }
    })

    response.render('blog-posts/new', { errors: errors })

  }
}
