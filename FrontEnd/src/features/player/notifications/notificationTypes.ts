export type NotificationType = | "TEAM_INVITE" | "MATCH_ALERT" | "ANNOUNCEMENT";

export interface Notification {
    _id: string;
    type: NotificationType;
    title: string;
    message: string;
    meta?: {
        teamId?: string;
        requestType?: "invite";
        inviteStatus?: "pending" | "approved" | "rejected";
    };
    isRead: boolean;
    createdAt: string;
}
