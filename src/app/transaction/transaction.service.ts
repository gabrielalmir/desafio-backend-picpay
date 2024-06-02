import { Injectable } from "@nestjs/common";

import { PrismaService } from "src/infra/prisma/prisma.service";
import { CreateTransactionDto } from "./dtos/create-transaction.dto";

@Injectable()
export class TransactionService {
    constructor(private readonly prismaService: PrismaService) {
        this.prismaService = prismaService;
    }

    async createTransaction(createTransactionDto: CreateTransactionDto) {
        const transactionCreated = await this.prismaService.transaction.create({
            data: {
                value: createTransactionDto.value,
                payerId: createTransactionDto.payerId,
                payeeId: createTransactionDto.payeeId,
            },
        });

        return transactionCreated;
    }
}
