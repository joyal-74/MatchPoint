import { NodeCronScheduler } from 'infra/services/NodeCronScheduler';
import { deleteUnverifiedUsersCron } from 'infra/cron/deleteUnverifiedUsersCron';
import { logger } from '../shared/providers';
import { managerRepository, playerRepository, userRepository } from 'presentation/composition/shared/repositories';

const scheduler = new NodeCronScheduler();
deleteUnverifiedUsersCron(scheduler, userRepository, playerRepository, managerRepository, logger);

export { scheduler };
