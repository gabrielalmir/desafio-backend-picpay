import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTransactionDto } from "./dtos/create-transaction.dto";

@Injectable()
export class TransactionService {
    constructor(private readonly prismaService: PrismaService) {
        this.prismaService = prismaService;
    }

    async createTransaction(createTransactionDto: CreateTransactionDto) {
        try {
            const transactionCreated = await this.prismaService.transaction.create({
                data: {
                    value: createTransactionDto.value,
                    payerId: createTransactionDto.payerId,
                    payeeId: createTransactionDto.payeeId,
                },
            });

            return transactionCreated;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2003') {
                throw new NotFoundException('User not found');
            }

            throw error;
        }
    }
}
