import { AdminToResponseDTO } from "../../domain/dtos/Admin.dto";
import { AdminResponse } from "../../domain/entities/Admin";


export class AdminMapper {
    static toAdminDTO(admin: AdminResponse): AdminToResponseDTO {
        return {
            _id: admin._id,
            email: admin.email,
            firstName: admin.firstName,
            lastName: admin.lastName,
            role: "admin",
            wallet: admin.wallet,
        };
    }
}