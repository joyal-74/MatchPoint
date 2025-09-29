export interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    phone: string;
    gender: string;
    bio: string;
    location: string;
    country: string;
}

export type profileData = {
    firstName: string; 
    lastName: string; 
    username: string; 
    profileImage?: string;
};