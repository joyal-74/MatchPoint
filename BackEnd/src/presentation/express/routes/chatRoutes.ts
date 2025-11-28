import { Router } from "express";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { playerChatController } from "presentation/composition/player/chats";
import { messageController } from "presentation/composition/player/messages";

const router = Router();

router.get("/user/:userId", expressAdapter(playerChatController.getMyChats));
router.post("/:chatId/messages", expressAdapter(messageController.sendMessage));
router.get("/:chatId/messages", expressAdapter(messageController.getMessages));
router.patch("/:messageId/status", expressAdapter(messageController.updateStatus));

export default router;