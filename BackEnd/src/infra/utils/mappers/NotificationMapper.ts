import { NotificationResponse } from "../../../app/repositories/interfaces/shared/INotificationRepository";
import { NotificationDocument } from "../../databases/mongo/models/NotificationModel";


export class NotificationMapper {
    static toResponse(doc: NotificationDocument): NotificationResponse {
        return {
            _id: doc._id.toString(),
            userId: doc.userId.toString(),
            type: doc.type,
            title: doc.title,
            message: doc.message,
            meta: doc.meta,
            isRead: doc.isRead,
            createdAt: doc.createdAt
        };
    }

    static toResponseArray(docs: NotificationDocument[]): NotificationResponse[] {
        return docs.map(doc => this.toResponse(doc));
    }
}
