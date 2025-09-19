import { AllRole } from "domain/enums/Roles";

export interface JwtPayload {
    userId: string;
    role: AllRole;
}