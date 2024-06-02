import { Wallet } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class WalletEntity implements Wallet {
  id: number;
  fullName: string;
  cpf: bigint;
  email: string;
  password: string;
  type: number;
  balance: Decimal;
  version: bigint;

  constructor(wallet: Wallet) {
    this.id = wallet.id;
    this.fullName = wallet.fullName;
    this.cpf = wallet.cpf;
    this.email = wallet.email;
    this.password = wallet.password;
    this.type = wallet.type;
    this.balance = wallet.balance;
    this.version = wallet.version;
  }

  transfer(value: number, wallet: WalletEntity) {
    this.balance = this.balance.sub(value);
    wallet.balance = wallet.balance.add(value);
  }

  toUpdate() {
    return {
      id: this.id,
      balance: this.balance,
      version: this.version + BigInt(1),
    };
  }
}
