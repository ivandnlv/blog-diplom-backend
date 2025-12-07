import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorEnvelope {
  data: null;
  message: string | string[] | null;
  error: string | null;
  statusCode: number;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode: number;
    let message: string | string[] | null = null;
    let error: string | null = null;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const resp = exception.getResponse();

      if (typeof resp === 'string') {
        message = resp;
        error = exception.name;
      } else if (typeof resp === 'object' && resp !== null) {
        const r: any = resp;
        message = r.message ?? null;
        error = r.error ?? exception.name;
      } else {
        message = exception.message;
        error = exception.name;
      }
    } else {
      // Непредвиденная ошибка (не HttpException)
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      if (exception && typeof exception === 'object') {
        const e: any = exception;
        message = e.message ?? 'Internal server error';
      } else {
        message = 'Internal server error';
      }
      error = 'InternalServerError';
    }

    const envelope: ErrorEnvelope = {
      data: null,
      message,
      error,
      statusCode,
    };

    response.status(statusCode).json(envelope);
  }
}
