import { inject, injectable } from "tsyringe";
import { IGetUserWalletUseCase } from "../../repositories/interfaces/usecases/IFinancialUseCases.js";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { DomainTransaction, IFinancialRepository } from "../../repositories/interfaces/manager/IFinancialRepository.js";
import { NotFoundError } from "../../../domain/errors/index.js";

@injectable()
export class GetUserWalletUseCase implements IGetUserWalletUseCase {
    constructor(
        @inject(DI_TOKENS.FinancialRepository) private _financialRepository: IFinancialRepository
    ) { }

    async execute(userId: string): Promise<{ balance: number; transactions: DomainTransaction[]; }> {
        if(!userId) throw new NotFoundError('Userid required');

        const result = await this._financialRepository.getWalletReport(userId);

        return result;
    }
}