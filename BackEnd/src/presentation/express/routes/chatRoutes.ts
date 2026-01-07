import { Router } from "express";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { playerChatController } from "presentation/composition/player/chats";
import { MessageController } from "presentation/http/controllers/player/MessageController";
import { container } from "tsyringe";

const router = Router();

const messageController = container.resolve(MessageController)

router.get("/user/:userId", expressAdapter(playerChatController.getMyChats));
router.post("/:chatId/messages", expressAdapter(messageController.sendMessage));
router.get("/:chatId/messages", expressAdapter(messageController.getMessages));
router.patch("/:messageId/status", expressAdapter(messageController.updateStatus));

export default router;