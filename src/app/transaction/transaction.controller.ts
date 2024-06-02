import { Body, Controller, Post } from '@nestjs/common';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(readonly transactionService: TransactionService) {
    this.transactionService = transactionService;
  }

  @Post()
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return await this.transactionService.createTransaction(
      createTransactionDto,
    );
  }
}
