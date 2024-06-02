import { Module } from '@nestjs/common';
import { TransactionModule } from './app/transaction/transaction.module';
import { WalletModule } from './app/wallet/wallet.module';

@Module({
  imports: [WalletModule, TransactionModule],
})
export class AppModule {}
