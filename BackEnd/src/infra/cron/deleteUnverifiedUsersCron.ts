import { inject, singleton } from "tsyringe";
import { IScheduler } from "../../app/repositories/interfaces/providers/IScheduler.js";
import { DeleteUnverifiedUsers } from "../../app/usecases/auth/DeleteUnverifiedUsers.js";
import { ILogger } from "../../app/providers/ILogger.js";
import { DI_TOKENS } from "../../domain/constants/Identifiers.js";

@singleton()
export class DeleteUnverifiedUsersCronJob {
    constructor(
        @inject(DI_TOKENS.Scheduler) private scheduler: IScheduler,
        @inject(DI_TOKENS.Logger) private _logger: ILogger,
        @inject(DeleteUnverifiedUsers) private _deleteUnverifiedUsers: DeleteUnverifiedUsers
    ) { }

    public start(): void {
        const cronSchedule = process.env.CRON_DELETE_UNVERIFIED_USERS || "0 * * * *";

        this._logger.info(`Job [DeleteUnverifiedUsers] scheduled with: "${cronSchedule}"`);

        this.scheduler.schedule(cronSchedule, async () => {
            try {
                const count = await this._deleteUnverifiedUsers.execute();
                if (count > 0) {
                    this._logger.info(`Deleted ${count} unverified users`);
                }
            } catch (error: unknown) {
                this._logger.error("Error running DeleteUnverifiedUsers cron job", { error: String(error) });
            }
        });
    }
}
