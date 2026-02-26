export interface IClearAllNotifications {
    execute(userId: string): Promise<number>;
}
