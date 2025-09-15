import { PersistedOtp } from "@shared/types/Types";

export interface IOtpRepository {
    saveOtp(id : string, otp: string, expiry : Date) : Promise<PersistedOtp>;
    findOtp(id : string) : Promise<PersistedOtp | null>;
    deleteOtp(userId : string) : Promise<void>;
}