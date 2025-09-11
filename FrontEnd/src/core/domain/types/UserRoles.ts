export const UserRole = {
    Admin: "ADMIN",
    Player: "PLAYER",
    Manager: "MANAGER",
    Viewer: "VIEWER",
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export type Theme = "light" | "dark";

export type Gender = "male" | "female";