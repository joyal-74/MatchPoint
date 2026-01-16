export type ResolutionKey = "auto" | "low" | "medium" | "high";

export const RESOLUTIONS: Record<ResolutionKey, MediaTrackConstraints> = {
    auto: {},
    low: { width: 640, height: 360 },
    medium: { width: 1280, height: 720 },
    high: { width: 1920, height: 1080 },
};