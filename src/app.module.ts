import { Module } from '@nestjs/common';
import { WalletModule } from './app/wallet/wallet.module';

@Module({
  imports: [WalletModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
