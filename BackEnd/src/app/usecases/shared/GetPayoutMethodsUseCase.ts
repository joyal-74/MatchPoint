import { IPayoutRepository } from "../../repositories/interfaces/shared/IPayoutRepository";
import { IPayoutResponse } from "../../../domain/dtos/PayoutResponse.dto";
import { ILogger } from "../../providers/ILogger";
import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { IGetPayoutMethodUseCase } from "../../repositories/interfaces/usecases/IFinancialUseCases";

@injectable()
export class GetPayoutMethodsUseCase implements IGetPayoutMethodUseCase {
    constructor(
        @inject(DI_TOKENS.PayoutRepository) private _payoutRepository: IPayoutRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger,
    ) { }

    async execute(userId: string): Promise<IPayoutResponse[]> {
        this._logger.info(`Fetching payout methods for userId: ${userId}`);

        const methods = await this._payoutRepository.findByUser(userId);

        this._logger.info(`Successfully retrieved ${methods.length} payout methods for userId: ${userId}`);
        return methods;
    }
}
