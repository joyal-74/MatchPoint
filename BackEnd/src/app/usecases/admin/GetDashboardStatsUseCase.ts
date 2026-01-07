import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { ILogger } from "app/providers/ILogger";
import { IGetDashboardStatsUseCase } from "app/repositories/interfaces/admin/IAdminUsecases";
import { IDashboardRepository } from "app/repositories/interfaces/admin/IDashboardRepository";


@injectable()
export class GetDashboardStatsUseCase implements IGetDashboardStatsUseCase {
    constructor(
        @inject(DI_TOKENS.DashboardRepository) private _dashboardRepository: IDashboardRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger,

    ) {}

    async execute() {
        return await this._dashboardRepository.getDashboardStats();
    }
}