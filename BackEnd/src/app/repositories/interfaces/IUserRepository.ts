import { UserRegisterResponseDTO } from "domain/dtos/User.dto";
import { User, UserRegister, UserResponse } from "domain/entities/User";
import { AllRole } from "domain/enums/Roles";

export interface IUserRepository {
    // Find user by MongoDB _id
    findById(_id: string): Promise<UserResponse | null>;

    // Find user by email
    findByEmail(email: string): Promise<UserResponse | null>;

    // Find users by role
    findByRole(role: AllRole): Promise<UserResponse[]>;

    // Create a new user
    create(user: UserRegister): Promise<UserRegisterResponseDTO>;

    // Update user by MongoDB _id
    update(_id: string, data: Partial<User>): Promise<UserResponse>;

    // Delete unverified users created before a specific date
    deleteUnverifiedUsersBefore(date: Date): Promise<number>;
}
