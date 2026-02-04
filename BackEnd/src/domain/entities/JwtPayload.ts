import { FacebookPictureData } from "../../app/services/auth/IFacebookServices.js";
import { AllRole } from "../../domain/enums/Roles.js";

export interface JwtPayload {
    userId: string;
    role: AllRole;
}

export interface JwtTempPayload {
    email: string;
    name: string;
    picture?: FacebookPictureData | string;
}
