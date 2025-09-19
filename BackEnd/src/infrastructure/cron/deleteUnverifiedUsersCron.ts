// // infra/cron/deleteUnverifiedUsersCron.ts
// import cron from 'node-cron';
// import { DeleteUnverifiedUsers } from '@core/domain/usecases/common/deleteUnverifiedUsers'; 
// import { UserRepositoryMongo } from '@infra/persistence/repositories/mongo/UserRepositoryMongo'; 

// export const deleteUnverifiedUsersCron = () => {
//     const userRepo = new UserRepositoryMongo();
//     const deleteUnverifiedUsers = new DeleteUnverifiedUsers(userRepo);

//     cron.schedule('0 * * * *', async () => {
//         const count = await deleteUnverifiedUsers.execute();
//         console.log(`Deleted ${count} unverified users`);
//     });
// };