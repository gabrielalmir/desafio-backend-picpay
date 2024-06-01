import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { FastifyReply } from 'fastify';

@Catch(Prisma.PrismaClientKnownRequestError, Prisma.NotFoundError, Prisma.PrismaClientUnknownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<FastifyReply>();

        switch (exception.code) {
            case 'P2002':
                response.status(409).send({
                    statusCode: 409,
                    message: 'Conflict resource',
                    error: 'Conflict',
                });
                break;
            case 'P2003':
                response.status(404).send({
                    statusCode: 404,
                    message: 'Resource not found',
                    error: 'Not Found',
                });
                break;
            default:
                response.status(500).send({
                    statusCode: 500,
                    message: 'Internal server error',
                    error: 'Internal Server Error',
                });
                break;
        }
    }
}
