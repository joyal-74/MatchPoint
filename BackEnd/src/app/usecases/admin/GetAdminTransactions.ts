import { IGetAdminTransactions } from "app/repositories/interfaces/admin/IAdminUsecases";
import { ITransactionRepository } from "app/repositories/interfaces/shared/ITransactionRepository";
import { AdminFilters } from "domain/dtos/Team.dto";

export class GetAdminTransactions implements IGetAdminTransactions {
    constructor(
        private transactionRepo: ITransactionRepository
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