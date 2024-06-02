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
    const { payerWallet, payeeWallet } = await this.getWallets(
      createTransactionDto.payerId,
      createTransactionDto.payeeId,
    );

    if (
      !(await this.validateTransaction(
        payerWallet,
        payeeWallet,
        createTransactionDto,
      ))
    ) {
      throw new InvalidTransactionError('Invalid transaction');
    }

    await this.transact(async () => {
      const newTransaction = await this.prismaService.transaction.create({
        data: {
          value: createTransactionDto.value,
          payerId: createTransactionDto.payerId,
          payeeId: createTransactionDto.payeeId,
        },
      });

      await this.prismaService.wallet.update({
        where: { id: createTransactionDto.payerId },
        data: { balance: payerWallet.balance.sub(createTransactionDto.value) },
      });

      await this.prismaService.wallet.update({
        where: { id: createTransactionDto.payeeId },
        data: { balance: payeeWallet.balance.add(createTransactionDto.value) },
      });

      await this.notificationService.notify(newTransaction);
    });
  }

  private async validateTransaction(
    payer: Wallet,
    payee: Wallet,
    createTransactionDto: CreateTransactionDto,
  ) {
    return (
      createTransactionDto.payeeId !== createTransactionDto.payerId &&
      payer &&
      payee &&
      payer.balance.gte(createTransactionDto.value) &&
      payer.type !== 2
    );
  }

  async getWallets(payerId: number, payeeId: number) {
    const [payerWallet, payeeWallet] = await Promise.all([
      this.prismaService.wallet.findUnique({
        where: { id: payerId },
      }),
      this.prismaService.wallet.findUnique({
        where: { id: payeeId },
      }),
    ]);

    return { payerWallet, payeeWallet };
  }

  async transact(callback: () => Promise<void>) {
    await this.prismaService.$queryRaw`BEGIN TRANSACTION`;
    try {
      await callback();
      await this.prismaService.$queryRaw`COMMIT`;
    } catch (error) {
      await this.prismaService.$queryRaw`ROLLBACK`;
      throw error;
    }
  }
}
