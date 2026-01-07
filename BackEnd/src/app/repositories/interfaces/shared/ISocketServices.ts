export interface IRoomRegistry {
    getOrCreateRoom(matchId: string): Promise<any>;
    removeRoom(matchId: string) : void
}