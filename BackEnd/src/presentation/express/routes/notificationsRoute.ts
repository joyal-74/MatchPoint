import { Router } from "express";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { NotificationController } from "presentation/http/controllers/player/NotificationController";
import { container } from "tsyringe";


const router = Router();
const notificationsController = container.resolve(NotificationController)

router.get('/:playerId', expressAdapter(notificationsController.getNotifications));

router.get('/:playerId/unread', expressAdapter(notificationsController.getUnreadCount));

export default router;