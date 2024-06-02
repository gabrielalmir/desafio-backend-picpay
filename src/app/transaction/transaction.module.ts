import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infra/prisma/prisma.module';
import { QueueModule } from 'src/infra/queue/queue.module';
import { AuthorizeService } from './services/authorize.service';
import { NotificationService } from './services/notification.service';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [
    PrismaModule,
    QueueModule,
    BullModule.registerQueue({
      name: 'notification',
    }),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, AuthorizeService, NotificationService],
})
export class TransactionModule {}
