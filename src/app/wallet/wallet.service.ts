import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
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

        try {
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
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException('User already exists');
            }

            throw error;
        }
    }
}
