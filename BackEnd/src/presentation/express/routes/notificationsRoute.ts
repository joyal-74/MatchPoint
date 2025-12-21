import { Router } from "express";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { notificationsController } from "presentation/composition/player/notifications";

const router = Router();

router.get('/:playerId', expressAdapter(notificationsController.getNotifications));

router.get('/:playerId/unread', expressAdapter(notificationsController.getUnreadCount));

export default router;