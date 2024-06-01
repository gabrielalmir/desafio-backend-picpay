import { IsNumber } from "class-validator";

export abstract class CreateTransactionDto {
    @IsNumber()
    readonly value: number;

    @IsNumber()
    readonly payerId: number;

    @IsNumber()
    readonly payeeId: number;
}
