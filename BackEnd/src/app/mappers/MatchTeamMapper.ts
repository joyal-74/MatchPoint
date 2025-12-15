import { TeamEntity } from "domain/entities/Match";

export class MatchTeamMapper {
    static toEntity(raw: any): TeamEntity {
        return {
            _id: raw?._id?.toString() ?? "",
            name: raw?.teamName || raw?.name || "",
            logo: raw?.logo || "",
            members: raw?.members || []
        };
    }
}