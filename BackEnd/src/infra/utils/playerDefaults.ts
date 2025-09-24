// infra/utils/playerDefaults.ts
import { sportProfileConfig, sportCareerStatsConfig } from '../../infra/utils/sportsConfig'

export function getDefaultProfile(sport: string) {
    const key = sport.toLowerCase();
    const profileConfig = sportProfileConfig[key];
    if (!profileConfig) return {};

    const profile: Record<string, any> = {};
    profileConfig.forEach(field => {
        switch (field.type) {
            case "number":
                profile[field.key] = 0;
                break;
            default:
                profile[field.key] = "";
        }
    });

    return profile;
}

export function getDefaultCareerStats(sport: string) {
    const key = sport.toLowerCase();
    const statsConfig = sportCareerStatsConfig[key];
    if (!statsConfig) return {};

    const stats: Record<string, any> = {};

    Object.entries(statsConfig).forEach(([category, fields]) => {
        stats[category] = {};
        fields.forEach(field => {
            stats[category][field.key] = 0;
        });
    });

    return stats;
}
