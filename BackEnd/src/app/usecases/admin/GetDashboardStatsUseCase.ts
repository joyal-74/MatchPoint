import { ILogger } from "app/providers/ILogger";
import { IGetDashboardStatsUseCase } from "app/repositories/interfaces/admin/IAdminUsecases";
import { IDashboardRepository } from "app/repositories/interfaces/admin/IDashboardRepository";

export class GetDashboardStatsUseCase implements IGetDashboardStatsUseCase {
    constructor(
        private _dashboardRepository: IDashboardRepository,
        private _logger: ILogger,

    ) {}

    async execute() {
        return await this._dashboardRepository.getDashboardStats();
    }
}