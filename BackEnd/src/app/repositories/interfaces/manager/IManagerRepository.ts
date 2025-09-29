import { Manager, ManagerRegister, ManagerResponse } from "domain/entities/Manager";

export interface IManagerRepository {
    findById(_id: string): Promise<ManagerResponse | null>;

    findByEmail(email: string): Promise<ManagerResponse | null>;

    create(manager: ManagerRegister): Promise<ManagerResponse>;

    update(_id: string, data: Partial<Manager>): Promise<ManagerResponse>;

    deleteByUserId(userId: string): Promise<void>;
}