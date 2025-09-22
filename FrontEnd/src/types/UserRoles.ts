export const UserRole = {
    Admin: "admin",
    Player: "player",
    Manager: "manager",
    Viewer: "viewer",
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const SignupRoles = {
    Player: "player",
    Manager: "manager",
    Viewer: "viewer",
} as const;

export type SignupRole = typeof SignupRoles[keyof typeof SignupRoles];

export type Theme = "light" | "dark";

export type Gender = "male" | "female";