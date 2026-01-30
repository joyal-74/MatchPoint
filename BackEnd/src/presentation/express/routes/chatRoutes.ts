import { Router } from "express";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { ChatController } from "presentation/http/controllers/player/ChatController";
import { MessageController } from "presentation/http/controllers/player/MessageController";
import { container } from "tsyringe";

const router = Router();

const messageController = container.resolve(MessageController);
const playerChatController = container.resolve(ChatController);

router.get("/user/:userId", expressAdapter(playerChatController.getMyChats));
router.post("/:chatId/messages", expressAdapter(messageController.sendMessage));
router.get("/:chatId/messages", expressAdapter(messageController.getMessages));
router.patch("/:messageId/status", expressAdapter(messageController.updateStatus));

export default router;