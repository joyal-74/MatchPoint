export interface RefreshToken {
    _id?: string;
    token: string;
    userId: string;
    expiresAt: Date;
    isRevoked?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}