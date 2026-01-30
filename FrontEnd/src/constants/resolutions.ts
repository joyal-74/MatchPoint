export type ResolutionKey = "auto" | "low" | "medium" | "high";

export interface VideoResolution {
    width: number;
    height: number;
    bitrate: number;
}

export interface AutoResolution {
    label: string;
}

export type ResolutionValue = AutoResolution | VideoResolution;

export const RESOLUTIONS: Record<ResolutionKey, ResolutionValue> = {
    auto: { label: "Auto" },
    low: { width: 640, height: 360, bitrate: 500_000 },
    medium: { width: 1280, height: 720, bitrate: 1_500_000 },
    high: { width: 1920, height: 1080, bitrate: 3_000_000 },
};