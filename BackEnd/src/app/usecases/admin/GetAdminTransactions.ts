import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IGetAdminTransactions } from "../../repositories/interfaces/admin/IAdminUsecases.js";
import { ITransactionRepository } from "../../repositories/interfaces/shared/ITransactionRepository.js";
import { AdminFilters } from "../../../domain/dtos/Team.dto.js";


@injectable()
export class GetAdminTransactions implements IGetAdminTransactions {
    constructor(
        @inject(DI_TOKENS.TransactionRepository) private _transactionRepo: ITransactionRepository
    ) { }

    async execute(params: AdminFilters) {
        const [listResult, stats] = await Promise.all([
            this._transactionRepo.findAllTransactions(params),
            this._transactionRepo.getStats()
        ]);

        return { data: listResult.data, total: listResult.total, stats: stats };
    }
}
