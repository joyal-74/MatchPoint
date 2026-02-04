import { CreateNotificationDTO, INotificationRepository, NotificationResponse } from "../../../app/repositories/interfaces/shared/INotificationRepository.js";
import { NotificationDocument, NotificationModel } from "../../databases/mongo/models/NotificationModel.js";

export class NotificationRepository implements INotificationRepository {

    async create(data: CreateNotificationDTO): Promise<NotificationResponse> {
        const notification = await NotificationModel.create({
            userId: data.userId,
            type: data.type,
            title: data.title,
            message: data.message,
            meta: data.meta
        });

        return this.toResponse(notification);
    }

    async findByUser(userId: string, options?: { limit?: number; skip?: number; unreadOnly?: boolean }): Promise<NotificationResponse[]> {

        const query: {
            userId: string;
            isRead?: boolean;
        } = { userId };

        if (options?.unreadOnly) {
            query.isRead = false;
        }

        const notifications = await NotificationModel
            .find(query)
            .sort({ createdAt: -1 })
            .skip(options?.skip ?? 0)
            .limit(options?.limit ?? 20)
            .lean<NotificationDocument[]>();

        return notifications.map(n => this.toResponse(n));
    }
    
    async markAsRead(notificationId: string, userId: string): Promise<NotificationResponse | null> {
        const updatedDoc = await NotificationModel.findOneAndUpdate(
            { _id: notificationId, userId },
            { $set: { isRead: true } },
            { new: true }
        ).lean<NotificationDocument>();

        if (!updatedDoc) return null;

        return this.toResponse(updatedDoc);

    }

    async markAllAsRead(userId: string): Promise < void> {
            await NotificationModel.updateMany(
                { userId, isRead: false },
                { $set: { isRead: true } }
            );
        }

    async getUnreadCount(userId: string): Promise < number > {
            return NotificationModel.countDocuments({
                userId,
                isRead: false
            });
        }

    private toResponse(notification: NotificationDocument): NotificationResponse {
        return {
            _id: notification._id.toString(),
            userId: notification.userId.toString(),
            type: notification.type,
            title: notification.title,
            message: notification.message,
            meta: notification.meta,
            isRead: notification.isRead,
            createdAt: notification.createdAt
        };
    }

    async markInviteAsRead(playerId: string, teamId: string, status: string) {
        await NotificationModel.updateMany(
            {
                userId: playerId,
                "meta.teamId": teamId,
                type: "TEAM_INVITE"
            },
            {
                $set: {
                    "meta.inviteStatus": status,
                    isRead: true
                }
            }
        );
    }
}
