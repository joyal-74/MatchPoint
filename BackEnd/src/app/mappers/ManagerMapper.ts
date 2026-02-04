import { ManagerLoginResponseDTO, ManagerResponseDTO } from "../../domain/dtos/Manager.dto.js";
import { UserResponseDTO } from "../../domain/dtos/User.dto.js";
import { ManagerResponse } from "../../domain/entities/Manager.js";
import { User } from "../../domain/entities/User.js";
import { ManagerDetails } from "../usecases/admin/GetManagerDetails.js";



export class ManagerMapper {
    static toLoginResponseDTO(manager: ManagerLoginResponseDTO): ManagerLoginResponseDTO {
        return {
            _id: manager._id,
            firstName: manager.firstName,
            lastName: manager.lastName,
            email: manager.email,
            role: manager.role,
            wallet: manager.wallet,
            profileImage: manager.profileImage,
        };
    }

    static toProfileResponseDTO(manager: ManagerResponseDTO | UserResponseDTO): ManagerResponseDTO {
        return {
            _id: manager._id,
            userId: manager.userId,
            email: manager.email,
            firstName: manager.firstName,
            lastName: manager.lastName,
            username: manager.username,
            role: manager.role,
            gender: manager.gender,
            phone: manager.phone || null,
            wallet: manager.wallet,
            bio: manager.bio,
            profileImage: manager.profileImage
        };
    }

    static toManagerDetailsDTO(manager: ManagerResponse): ManagerDetails {
        const user = manager.userId as unknown as User;

        return {
            _id: manager._id,
            fullName: `${user.firstName} ${user.lastName}`,
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.isActive ? "Active" : "Blocked",
            subscription: user.subscription || "Free",
            joinedAt: user.createdAt.toLocaleDateString(),
            profileImage: user.profileImage || "",
            stats: {
                tournamentsCreated: manager.tournamentsCreated?.length || 0,
                tournamentsParticipated: manager.tournamentsParticipated?.length || 0,
                totalTeams: manager.teams?.length || 0,
            },
            isBlocked: !user.isActive,
        };
    }

}
