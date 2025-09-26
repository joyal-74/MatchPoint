import { AdminResponse } from "domain/entities/Admin";
import { AdminToResponseDTO } from "domain/dtos/Admin.dto";

export class AdminMapper {
    static toAdminDTO(admin: AdminResponse): AdminToResponseDTO {
        return {
            _id: admin._id,
            email: admin.email,
            first_name: admin.first_name,
            last_name: admin.last_name,
            role: "admin",
            wallet: admin.wallet,
        };
    }
}