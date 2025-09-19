export interface Otp {
    userId: string;
    email: string;
    otp: string;
    createdAt: Date;
}

export interface OtpResponse extends Otp {
    _id: string;
}