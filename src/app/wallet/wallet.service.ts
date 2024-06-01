import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateWalletDto } from "./dtos/create-wallet.dto";
import { WalletType } from "./enums/wallet-type.enum";

@Injectable()
export class WalletService {
    constructor(readonly prismaService: PrismaService) {
        this.prismaService = new PrismaService();
    }

    async createWallet(wallet: CreateWalletDto) {
        const walletTypes = Object.values(WalletType);

        const walletCreated = await this.prismaService.wallet.create({
            data: {
                fullName: wallet.fullName,
                cpf: BigInt(wallet.cpf),
                email: wallet.email,
                password: wallet.password,
                type: walletTypes.indexOf(wallet.type),
            }
        })

        return walletCreated;
    }
}
