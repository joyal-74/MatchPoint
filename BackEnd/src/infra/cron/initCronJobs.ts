import { DeleteUnverifiedUsersCronJob } from '../../infra/cron/deleteUnverifiedUsersCron.js';
import { container } from 'tsyringe';

let cronJob: DeleteUnverifiedUsersCronJob | undefined;

export const startCronJobs = () => {
    cronJob = container.resolve(DeleteUnverifiedUsersCronJob);
    cronJob.start();
};
