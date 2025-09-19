export const Gender = {
    Male: "male",
    Female: "female",
    Other: "other",
} as const;

export type Gender = typeof Gender[keyof typeof Gender];

export const GenderValues = Object.values(Gender);
