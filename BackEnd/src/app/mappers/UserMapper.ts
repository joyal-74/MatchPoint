import { UserLoginResponseDTO, UserResponseDTO } from "domain/dtos/User.dto";
import { UserResponse } from "domain/entities/User";

export class UserMapper {
    static toUserLoginResponseDTO(user: UserResponse): UserLoginResponseDTO {
        return {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            wallet: user.wallet,
            profileImage: user.profileImage,
            isActive : user.isActive
        };
    }

    static toProfileResponseDTO(user : UserResponseDTO): UserResponseDTO {
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
            isActive : user.isActive
        };
    }
}