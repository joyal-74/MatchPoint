import { PlayerProfileFieldDTO } from "../../domain/dtos/Player.dto.js";
import { NotFoundError } from "../../domain/errors/index.js";


export function validatePlayerSportsFields(data: PlayerProfileFieldDTO): PlayerProfileFieldDTO {
    if (!data.userId) throw new NotFoundError("Missing player ID");

    const { sport, profile } = data;

    if (!sport || !profile) return data;

    switch (sport.toLowerCase()) {
        case "cricket":
            validateCricketProfile(profile); 
            break;
        default:
            console.warn(`No validation schema found for sport: ${sport}`);
    }

    return data;
}

function validateCricketProfile(profile: Record<string, string | number | boolean | null>) {
    if (!profile.battingStyle) throw new NotFoundError("Missing batting style");
    if (!profile.bowlingStyle) throw new NotFoundError("Missing bowling style");
    if (!profile.position) throw new NotFoundError("Missing Preferred playing position");
    if (!profile.jerseyNumber) throw new NotFoundError("Missing Jersey Number");
}
