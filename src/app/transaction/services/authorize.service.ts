import { HttpException, Injectable } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { env } from 'src/infra/config/env';
import { UnauthorizedError as UnauthorizedTransactionError } from '../errors/unauthorized-transaction.error';

@Injectable()
export class AuthorizeService {
  async authorize(transaction: Transaction) {
    if (!transaction.id) {
      throw new Error('Transaction ID is required');
    }

    const response = await fetch(env.AUTHORIZATION_SERVICE_URL);
    if (!response.ok) {
      throw new HttpException(
        'Failed to authorize transaction',
        response.status,
      );
    }

    const { status, data } = await response.json();

    if (status !== 'success' || !data.authorization) {
      throw new UnauthorizedTransactionError('Failed to authorize transaction');
    }
  }
}
