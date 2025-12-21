import { GetPlayerNotificationsUseCase } from "app/usecases/player/GetPlayerNotifications";
import { NotificationController } from "presentation/http/controllers/player/NotificationController";
import { notificationRepository } from "../shared/repositories";
import { GetUnreadCountUseCase } from "app/usecases/player/GetUnreadCountUseCase";

const getPlayerNotificationsUC = new GetPlayerNotificationsUseCase(notificationRepository)
const getUnreadCountUC = new GetUnreadCountUseCase(notificationRepository)


// Controller
export const notificationsController = new NotificationController(getPlayerNotificationsUC, getUnreadCountUC);