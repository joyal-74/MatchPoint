import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IGetAdminTransactions } from "app/repositories/interfaces/admin/IAdminUsecases";
import { ITransactionRepository } from "app/repositories/interfaces/shared/ITransactionRepository";
import { AdminFilters } from "domain/dtos/Team.dto";

@injectable()
export class GetAdminTransactions implements IGetAdminTransactions {
    constructor(
        @inject(DI_TOKENS.TransactionRepository) private transactionRepo: ITransactionRepository
    ) { }

    async execute(params: AdminFilters) {
        const [listResult, stats] = await Promise.all([
            this.transactionRepo.findAll(params),
            this.transactionRepo.getStats()
        ]);

        return {
            data: listResult.data,
            total: listResult.total,
            stats: stats
        };
    }
}