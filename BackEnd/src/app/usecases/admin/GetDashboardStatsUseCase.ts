import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { IDashboardRepository } from "../../repositories/interfaces/admin/IDashboardRepository";
import { ILogger } from "../../providers/ILogger";
import { IGetDashboardStatsUseCase } from "../../repositories/interfaces/admin/IAdminUsecases";


@injectable()
export class GetDashboardStatsUseCase implements IGetDashboardStatsUseCase {
    constructor(
        @inject(DI_TOKENS.DashboardRepository) private _dashboardRepository: IDashboardRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger,

    ) {}

    async execute() {
        this._logger.info('Fetching dashboard ststistics')
        return await this._dashboardRepository.getDashboardStats();
    }
}
