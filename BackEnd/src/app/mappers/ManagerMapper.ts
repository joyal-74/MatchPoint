import { ManagerResponseDTO } from "domain/dtos/Manager.dto";


export class ManagerMapper {
    static toResponseDTO(manager: ManagerResponseDTO, fileStorage?: { getUrl: (key: string) => string }): ManagerResponseDTO {
        return {
            _id: manager._id,
            userId: manager.userId,
            email: manager.email,
            first_name: manager.first_name,
            last_name: manager.last_name,
            username: manager.username,
            role: manager.role,
            gender: manager.gender,
            phone: manager.phone || null,
            wallet: manager.wallet,
            logo: manager.logo && fileStorage ? fileStorage.getUrl(manager.logo) : null
        };
    }
}
