import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IFinancialRepository } from "../../repositories/interfaces/manager/IFinancialRepository.js";
import { NotFoundError } from "../../../domain/errors/index.js";


@injectable()
export class GetManagerFinancialsUseCase {
    constructor(
        @inject(DI_TOKENS.FinancialRepository) private _financialRepository: IFinancialRepository
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
