import { sportProfileConfig, sportCareerStatsConfig } from './sportsConfig'


export function getDefaultProfile(sport: string) {
    const config = sportProfileConfig[sport] || [];
    return config.reduce((acc, field) => {
        acc[field.key] = null;
        return acc;
    }, {} as Record<string, any>);
}


export function getDefaultCareerStats(sport: string) {
    const config = sportCareerStatsConfig[sport] || {};
    const stats: Record<string, Record<string, number>> = {};

    for (const category in config) {
        stats[category] = {};
        for (const field of config[category]) {
            stats[category][field.key] = 0;
        }
    }

    return stats;
}
