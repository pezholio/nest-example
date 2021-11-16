import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response, Request } from 'express';
import { ValidationFailedError } from './validation-failed-error';

@Catch(ValidationFailedError)
export class ValidationExceptionFilter implements ExceptionFilter {
  view: string;
  objectName: string;

  constructor(view: string, objectName: string) {
    this.view = view;
    this.objectName = objectName;
  }

  async catch(exception: ValidationFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.render(this.view, {
      errors: exception.fullMessages(),
      [this.objectName]: exception.target,
      url: request.url,
    });
  }
}
