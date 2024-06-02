import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { HttpStatus, Logger } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { Job, Queue } from 'bull';
import { env } from 'src/infra/config/env';

@Processor('notification')
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectQueue('notification')
    private readonly queue: Queue,
  ) {}

  async notify(transaction: Transaction) {
    if (!transaction.id) {
      throw new Error('Transaction ID is required');
    }

    // Send notification
    await this.queue.add('send-notification', transaction);
  }

  @Process('send-notification')
  async sendNotification(job: Job<Transaction>) {
    this.logger.log(`Received job to send notification ${job.id}`);

    const { data: transaction } = job;

    // Send notification external service
    const response = await fetch(env.NOTIFICATION_SERVICE_URL, {
      method: 'POST',
    });

    if (!(response.status === HttpStatus.NO_CONTENT)) {
      throw new Error('Failed to send notification');
    }

    this.logger.log(`Notification sent for transaction ${transaction.id}`);
  }
}
