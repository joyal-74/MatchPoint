import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IGetTransactionDetails } from "app/repositories/interfaces/admin/IAdminUsecases";
import { ITransactionRepository } from "app/repositories/interfaces/shared/ITransactionRepository";
import { Transaction } from "domain/entities/Transaction";

@injectable()
export class GetTransactionDetails implements IGetTransactionDetails {
    constructor(
        @inject(DI_TOKENS.TransactionRepository) private transactionRepository: ITransactionRepository
    ) { }

    async execute(id: string): Promise<Transaction | null> {
        if (!id) {
            throw new Error("Transaction ID is required");
        }
        return await this.transactionRepository.findById(id);
    }
}