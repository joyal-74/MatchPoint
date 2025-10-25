import { AllRole } from "domain/enums/Roles";

export interface JwtPayload {
    userId: string;
    role: AllRole;
}

export interface JwtTempPayload {
    email: string;
    name: string;
    picture?: string;
}