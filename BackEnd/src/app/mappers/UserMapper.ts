import { UserLoginResponseDTO, UserResponseDTO } from "../../domain/dtos/User.dto.js"; 
import { UserResponse } from "../../domain/entities/User.js";
import { ViewerDetails } from "../usecases/admin/GetViewerDetails.js";


export class UserMapper {
    static toUserLoginResponseDTO(user: UserResponse): UserLoginResponseDTO {
        return {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            wallet: user.wallet,
            settings : user.settings,
            profileImage: user.profileImage,
            isActive: user.isActive,
            createdAt: user.createdAt,

        };
    }

    static toProfileResponseDTO(user: UserResponseDTO): UserResponseDTO {
        return {
            _id: user._id,
            userId: user.userId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            role: user.role,
            gender: user.gender,
            phone: user.phone || null,
            wallet: user.wallet,
            bio: user.bio,
            profileImage: user.profileImage,
            isActive: user.isActive,
            createdAt: user.createdAt,
        };
    }

    static toViewerDetailsDTO(user: UserResponse): ViewerDetails {
        return {
            _id: user._id,
            fullName: `${user.firstName} ${user.lastName}`,
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.isActive ? "Active" : "Blocked",
            subscription: user.subscription || "Free",
            joinedAt: user.createdAt.toLocaleDateString(),
            profileImage: user.profileImage || "",
            isBlocked: !user.isActive,
        };
    }
}
