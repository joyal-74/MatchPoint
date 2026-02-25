import { Router } from "express";
import { container } from "tsyringe";
import { MessageController } from "../../http/controllers/player/MessageController";
import { expressAdapter } from "../../adaptors/ExpressAdaptor";
import { playerOnly } from "../middlewares/index";
import { ChatController } from "../../http/controllers/player/ChatController";


const router = Router();

const messageController = container.resolve(MessageController);
const playerChatController = container.resolve(ChatController);

router.get("/user/:userId", playerOnly, expressAdapter(playerChatController.getMyChats));
router.post("/:chatId/messages", playerOnly, expressAdapter(messageController.sendMessage));
router.get("/:chatId/messages", playerOnly, expressAdapter(messageController.getMessages));
router.patch("/:messageId/status", playerOnly, expressAdapter(messageController.updateStatus));

export default router;
