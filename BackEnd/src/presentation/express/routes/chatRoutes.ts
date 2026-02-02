import { Router } from "express";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { ChatController } from "presentation/http/controllers/player/ChatController";
import { MessageController } from "presentation/http/controllers/player/MessageController";
import { container } from "tsyringe";
import { playerOnly } from "../middlewares";

const router = Router();

const messageController = container.resolve(MessageController);
const playerChatController = container.resolve(ChatController);

router.get("/user/:userId", playerOnly, expressAdapter(playerChatController.getMyChats));
router.post("/:chatId/messages", playerOnly, expressAdapter(messageController.sendMessage));
router.get("/:chatId/messages", playerOnly, expressAdapter(messageController.getMessages));
router.patch("/:messageId/status", playerOnly, expressAdapter(messageController.updateStatus));

export default router;