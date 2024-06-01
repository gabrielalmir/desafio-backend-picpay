import { Body, Controller, Post } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateWalletDto } from "./dtos/create-wallet.dto";
import { WalletService } from "./wallet.service";

@Controller("wallets")
export class WalletController {
    constructor(
        readonly walletService: WalletService,
        readonly prismaService: PrismaService
    ) {
        this.walletService = new WalletService(prismaService);
    }

    @Post()
    async createWallet(@Body() wallet: CreateWalletDto) {
        await this.walletService.createWallet(wallet);
    }
}
