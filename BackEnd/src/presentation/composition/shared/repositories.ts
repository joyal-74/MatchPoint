import { UserRepositoryMongo } from '../../../infra/repositories/mongo/UserRepositoryMongo';
import { AdminRepositoryMongo } from '../../../infra/repositories/mongo/AdminRepositoryMongo';
import { OtpRepositoryMongo } from '../../../infra/repositories/mongo/OtpRepositoryMongo';
import { ManagerRepositoryMongo } from 'infra/repositories/mongo/ManagerRepositoryMongo';
import { PlayerRepositoryMongo } from '../../../infra/repositories/mongo/PlayerRepositoryMongo';
import { TeamRepositoryMongo } from 'infra/repositories/mongo/TeamRepositoryMongo';
import { TournamentRepositoryMongo } from 'infra/repositories/mongo/TournamentRepoMongo';
import { RegistrationRepository } from 'infra/repositories/mongo/RegistrationRepository';

export const userRepository = new UserRepositoryMongo();
export const adminRepository = new AdminRepositoryMongo();
export const playerRepository = new PlayerRepositoryMongo();
export const managerRepository = new ManagerRepositoryMongo();
export const otpRepository = new OtpRepositoryMongo();
export const teamRepository = new TeamRepositoryMongo();
export const tournamentRepository = new TournamentRepositoryMongo();
export const registrationRepository = new RegistrationRepository();