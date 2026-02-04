import { createMediaWorker } from "./MediaWorker.js";
import { createMediaRouter } from "./MediaRouter.js";
import { MediaRoom } from "./MediaRoom.js";
import { IRoomRegistry } from "../../../app/repositories/interfaces/shared/ISocketServices.js";

export class RoomRegistry implements IRoomRegistry {
    private rooms = new Map<string, MediaRoom>();
    private workerPromise = createMediaWorker();
    

    async getOrCreateRoom(matchId: string): Promise<MediaRoom> {
        if (this.rooms.has(matchId)) {
            return this.rooms.get(matchId)!;
        }

        const worker = await this.workerPromise;
        const router = await createMediaRouter(worker);

        const room = new MediaRoom(matchId, router);
        this.rooms.set(matchId, room);

        router.on("@close", () => {
            if (this.rooms.has(matchId)) {
                this.rooms.delete(matchId);
                console.log(`[REGISTRY] Room ${matchId} auto-removed due to router closure`);
            }
        });

        return room;
    }

    removeRoom(matchId: string) {
        const room = this.rooms.get(matchId);
        if (!room) return;

        room.close();
        this.rooms.delete(matchId);
    }
}
