import { IFinancialRepository } from "app/repositories/interfaces/manager/IFinancialRepository";
import { NotFoundError } from "domain/errors";

export class GetManagerFinancialsUseCase {
    constructor(
        private _financialRepository: IFinancialRepository
    ) {}

    async execute(managerId: string) {
        if (!managerId) {
            throw new NotFoundError("Manager ID is required");
        }
        const result = await this._financialRepository.getManagerFinancialReport(managerId);
        console.log(result)
        return result;
    }
}