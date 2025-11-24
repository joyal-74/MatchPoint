import { PlayerProfileFieldDTO } from "domain/dtos/Player.dto";
import { NotFoundError } from "domain/errors";


export function validatePlayerSportsFields(data: PlayerProfileFieldDTO): PlayerProfileFieldDTO {
    if (!data.userId) throw new NotFoundError("Missing player ID");

    const { sport } = data;

    if (!sport) return data;

    switch (sport.toLowerCase()) {
        case "cricket":
            validateCricketProfile(data);
            break;
        default:
            console.warn(`No validation schema found for sport: ${sport}`);
    }

    return data;
}

function validateCricketProfile(data: Record<string, string | number | boolean | null>) {
    if (!data.battingStyle) throw new NotFoundError("Missing batting style");
    if (!data.bowlingStyle) throw new NotFoundError("Missing bowling style");
    if (!data.position) throw new NotFoundError("Missing Preffered playing position");
    if (!data.jerseyNumber) throw new NotFoundError("Missing Jersey Number");
}