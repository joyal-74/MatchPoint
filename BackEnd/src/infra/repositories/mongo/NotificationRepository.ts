import { CreateNotificationDTO, INotificationRepository, NotificationResponse } from "../../../app/repositories/interfaces/shared/INotificationRepository";
import { NotificationDocument, NotificationModel } from "../../databases/mongo/models/NotificationModel";
import { NotificationMapper } from "../../utils/mappers/NotificationMapper";
import { BaseRepository } from "./BaseRepository";

export class NotificationRepository extends BaseRepository<CreateNotificationDTO, NotificationResponse> implements INotificationRepository {

    async create(data: CreateNotificationDTO): Promise<NotificationResponse> {
        const notification = await NotificationModel.create({
            userId: data.userId,
            type: data.type,
            title: data.title,
            message: data.message,
            meta: data.meta
        });

        return NotificationMapper.toResponse(notification);
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

        return NotificationMapper.toResponseArray(notifications);
    }

    async markAsRead(notificationId: string, userId: string): Promise<NotificationResponse | null> {
        const updatedDoc = await NotificationModel.findOneAndUpdate(
            { _id: notificationId, userId },
            { $set: { isRead: true } },
            { new: true }
        ).lean<NotificationDocument>();

        if (!updatedDoc) return null;

        return NotificationMapper.toResponse(updatedDoc);

    }

    async markAllAsRead(userId: string): Promise<void> {
        await NotificationModel.updateMany(
            { userId, isRead: false },
            { $set: { isRead: true } }
        );
    }

    async getUnreadCount(userId: string): Promise<number> {
        return NotificationModel.countDocuments({
            userId,
            isRead: false
        });
    }

    async deleteAll(userId: string): Promise<number> {
        const result = await NotificationModel.deleteMany({
            userId: userId
        });

        return result.deletedCount;
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
