import { PlayerEntity } from "domain/entities/Player";

export class PlayerDetailsMapper {
    static toEntity(doc: any): PlayerEntity {
        if (!doc) return null as any;

        const user = doc.userId || {};

        return {
            _id: doc._id?.toString(),
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
            profileImage: user.profileImage || "",

            // Player profile
            battingStyle: doc.profile?.battingStyle || "",
            bowlingStyle: doc.profile?.bowlingStyle || "",
            role: doc.profile?.position || "",

            // Player stats
            stats: doc.stats || {
                batting: {},
                bowling: {},
                fielding: {},
                general: {}
            },
        };
    }

    static toEntityList(docs: any[]): PlayerEntity[] {
        return docs?.map(doc => this.toEntity(doc)) ?? [];
    }
}
