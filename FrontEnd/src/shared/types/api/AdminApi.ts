export interface ApiAdmin {
    _id?: string;
    email: string;
    first_name: string;
    last_name: string;
    wallet?: number;
    password: string;
    settings?: {
        theme?: string;
        language?: string;
        currency?: string;
    };
}

export interface LoginAdminRequest {
  email: string;
  password: string;
}

export interface AdminLogin {
  email: string;
  password: string;
}