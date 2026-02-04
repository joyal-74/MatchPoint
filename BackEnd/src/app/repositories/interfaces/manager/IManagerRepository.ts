import { Manager, ManagerRegister, ManagerResponse } from "../../../../domain/entities/Manager.js";

export interface IManagerRepository {
    findById(_id: string): Promise<ManagerResponse | null>;

    findByIdWithUser(_id: string): Promise<ManagerResponse | null>;

    findByEmail(email: string): Promise<ManagerResponse | null>;

    create(manager: ManagerRegister): Promise<ManagerResponse>;

    update(_id: string, data: Partial<Manager>): Promise<ManagerResponse>;

    addTournamentToManager(managerId: string, tournamentId: string): Promise<void>;

    joinTournamentUpdate(managerId: string, tournamentId: string): Promise<void>;

    addTeamToManager(managerId: string, teamId: string): Promise<void>;

    deleteByUserId(userId: string): Promise<void>;

    deleteManyByUserIds(userIds: string[]): Promise<number>;
}
