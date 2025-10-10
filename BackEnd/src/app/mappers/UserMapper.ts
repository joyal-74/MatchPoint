import { UserLoginResponseDTO } from "domain/dtos/User.dto";
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
        };
    }
}