import { IsEmail, IsEnum, IsString, Matches } from 'class-validator';
import { WalletType } from '../enums/wallet-type.enum';

export abstract class CreateWalletDto {
  @IsString()
  fullName: string;

  @Matches(/^[0-9]{11}$/)
  cpf: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(WalletType)
  type: WalletType;
}
