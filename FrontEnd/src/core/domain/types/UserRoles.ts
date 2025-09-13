export const UserRole = {
    Admin: "ADMIN",
    Player: "PLAYER",
    Manager: "MANAGER",
    Viewer: "VIEWER",
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const SignupRoles = {
    Player: "PLAYER",
    Manager: "MANAGER",
    Viewer: "VIEWER",
} as const;

export type SignupRole = typeof SignupRoles[keyof typeof SignupRoles];

export type Theme = "light" | "dark";

export type Gender = "male" | "female";