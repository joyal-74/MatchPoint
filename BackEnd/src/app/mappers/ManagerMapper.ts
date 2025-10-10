import { ManagerLoginResponseDTO, ManagerResponseDTO } from "domain/dtos/Manager.dto";


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

    static toProfileResponseDTO(manager: ManagerResponseDTO): ManagerResponseDTO {
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
}
