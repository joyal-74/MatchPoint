import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { IDeletePayoutMethodUseCase } from "../../repositories/interfaces/usecases/IFinancialUseCases";
import { IPayoutResponse } from "../../../domain/dtos/PayoutResponse.dto";
import { IPayoutRepository } from "../../repositories/interfaces/shared/IPayoutRepository";
import { ILogger } from "../../providers/ILogger";
import { NotFoundError } from "../../../domain/errors/index";

@injectable()
export class DeletePayoutMethodUseCase implements IDeletePayoutMethodUseCase {
    constructor(
        @inject(DI_TOKENS.PayoutRepository) private _payoutRepository: IPayoutRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger,
    ) { }

    async execute(userId: string, payoutId: string): Promise<IPayoutResponse[]> {

        this._logger.info(`Initiating deletion of payout method ${payoutId} for user ${userId}`);

        const methodToDelete = await this._payoutRepository.findById(payoutId);
        if (!methodToDelete) {
            this._logger.warn(`Delete attempt failed: Payout method ${payoutId} not found`);
            throw new NotFoundError("Payout method not found");
        }

        const wasPrimary = methodToDelete.isPrimary;

        const isDeleted = await this._payoutRepository.delete(payoutId);

        if (isDeleted) {
            this._logger.info(`Payout method ${payoutId} successfully deleted`);

            // 3. Reassign Primary if necessary
            if (wasPrimary) {
                this._logger.info(`Deleted method was primary. Attempting to reassign primary status for user ${userId}`);

                const remainingMethods = await this._payoutRepository.findByUser(userId);

                if (remainingMethods.length > 0) {
                    const newPrimaryId = remainingMethods[0]._id;
                    await this._payoutRepository.setPrimary(userId, newPrimaryId);
                    this._logger.info(`Promoted payout method ${newPrimaryId} to primary for user ${userId}`);
                } else {
                    this._logger.info(`No remaining payout methods for user ${userId} to promote to primary`);
                }
            }
        }

        return await this._payoutRepository.findByUser(userId);
    }
}
