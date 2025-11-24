import cron from "node-cron";
import { IScheduler } from "app/repositories/interfaces/providers/IScheduler"; 

export class NodeCronScheduler implements IScheduler {
    schedule(cronExpression: string, task: () => Promise<void>): void {
        cron.schedule(cronExpression, task);
    }
}