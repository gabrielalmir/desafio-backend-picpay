import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { FastifyReply } from 'fastify';

export class InvalidTransactionExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    response.status(400).send({
      statusCode: 400,
      message: 'Invalid transaction',
      error: 'Bad Request',
    });
  }
}
