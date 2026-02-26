import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { Transaction } from "../../../domain/entities/Transaction";
import { IGetTransactionDetails } from "../../repositories/interfaces/admin/IAdminUsecases";
import { ITransactionRepository } from "../../repositories/interfaces/shared/ITransactionRepository";
import { NotFoundError } from "../../../domain/errors/index";


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
