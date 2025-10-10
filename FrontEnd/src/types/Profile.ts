export interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    phone?: string;
    gender?: string;
    bio: string;
    profileImage : string
}

export type profileData = {
    firstName: string; 
    lastName: string; 
    username: string; 
    profileImage?: string;
};