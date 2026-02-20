import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { Transaction } from "../../../domain/entities/Transaction.js";
import { IGetTransactionDetails } from "../../repositories/interfaces/admin/IAdminUsecases.js";
import { ITransactionRepository } from "../../repositories/interfaces/shared/ITransactionRepository.js";
import { NotFoundError } from "../../../domain/errors/index.js";


@injectable()
export class GetTransactionDetails implements IGetTransactionDetails {
    constructor(
        @inject(DI_TOKENS.TransactionRepository) private transactionRepository: ITransactionRepository
    ) { }

    async execute(id: string): Promise<Transaction | null> {
        if (!id) {
            throw new NotFoundError("Transaction ID is required");
        }
        return await this.transactionRepository.findById(id);
    }
}