export const Role = {
  Manager: "manager",
  Player: "player",
  Viewer: "viewer",
} as const;

export type Role = (typeof Role)[keyof typeof Role];