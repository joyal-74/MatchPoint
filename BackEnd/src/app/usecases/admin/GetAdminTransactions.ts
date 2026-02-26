import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { IGetAdminTransactions } from "../../repositories/interfaces/admin/IAdminUsecases";
import { ITransactionRepository } from "../../repositories/interfaces/shared/ITransactionRepository";
import { AdminFilters } from "../../../domain/dtos/Team.dto";


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
