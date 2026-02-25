import { Router } from "express";

import { container } from "tsyringe";
import { NotificationController } from "../../http/controllers/shared/NotificationController.js";
import { expressAdapter } from "../../adaptors/ExpressAdaptor.js";


const router = Router();
const notificationsController = container.resolve(NotificationController)

router.get('/:playerId', expressAdapter(notificationsController.getNotifications));

router.get('/:playerId/unread', expressAdapter(notificationsController.getUnreadCount));

router.patch('/mark-read', expressAdapter(notificationsController.markAsRead));

router.delete('/clear-all', expressAdapter(notificationsController.deleteAllNotifications));

router.patch('/mark-all-read', expressAdapter(notificationsController.markAllAsRead));

export default router;