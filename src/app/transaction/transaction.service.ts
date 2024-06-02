import { Injectable } from '@nestjs/common';

import { Wallet } from '@prisma/client';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { InvalidTransactionError } from './errors/invalid-transaction.error';
import { AuthorizeService } from './services/authorize.service';
import { NotificationService } from './services/notification.service';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authorizeService: AuthorizeService,
    private readonly notificationService: NotificationService,
  ) {
    this.prismaService = prismaService;
  }

  async createTransaction(createTransactionDto: CreateTransactionDto) {
    const { payer, payee } = await this.getWallets(
      createTransactionDto.payerId,
      createTransactionDto.payeeId,
    );

    if (!(await this.validateTransaction(payee, payer, createTransactionDto))) {
      throw new InvalidTransactionError('Invalid transaction');
    }

    const result = await this.prismaService.$transaction(async (prisma) => {
      const payerWalletUpdate = prisma.wallet.update({
        where: { id: createTransactionDto.payerId },
        data: { balance: payer.balance.sub(createTransactionDto.value) },
      });

      const payeeWalletUpdate = prisma.wallet.update({
        where: { id: createTransactionDto.payeeId },
        data: { balance: payee.balance.add(createTransactionDto.value) },
      });

      const newTransaction = await prisma.transaction.create({
        data: {
          value: createTransactionDto.value,
          payerId: createTransactionDto.payerId,
          payeeId: createTransactionDto.payeeId,
        },
      });

      await Promise.all([payerWalletUpdate, payeeWalletUpdate]);

      await this.authorizeService.authorize(newTransaction);

      return newTransaction;
    });

    if (!result) {
      throw new InvalidTransactionError('Invalid transaction');
    }

    await this.notificationService.notify(result);
  }

  private async validateTransaction(
    payee: Wallet,
    payer: Wallet,
    transaction: CreateTransactionDto,
  ) {
    if (
      transaction.value < 0 ||
      transaction.payeeId === transaction.payerId ||
      !payee ||
      !payer
    ) {
      return false;
    }

    return payer?.balance.gte(transaction.value);
  }

  async getWallets(payerId: number, payeeId: number) {
    const [payer, payee] = await Promise.all([
      this.prismaService.wallet.findUnique({
        where: { id: payerId },
      }),
      this.prismaService.wallet.findUnique({
        where: { id: payeeId },
      }),
    ]);

    return { payer, payee };
  }
}
