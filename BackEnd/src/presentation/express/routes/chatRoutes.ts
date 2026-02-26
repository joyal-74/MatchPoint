import { Router } from "express";
import { container } from "tsyringe";
import { MessageController } from "../../http/controllers/player/MessageController";
import { expressAdapter } from "../../adaptors/ExpressAdaptor";
import { playerAndManagerOnly } from "../middlewares/index";
import { ChatController } from "../../http/controllers/player/ChatController";
import { TeamController } from "../../http/controllers/manager/TeamController";


const router = Router();

const messageController = container.resolve(MessageController);
const chatController = container.resolve(ChatController);
const teamController = container.resolve(TeamController);

router.get("/:userId/:role/teams", playerAndManagerOnly, expressAdapter(chatController.getAllTeams));
router.get("/team/:teamId/details", playerAndManagerOnly, expressAdapter(teamController.getTeamDetails));
router.get("/user/:userId", playerAndManagerOnly, expressAdapter(chatController.getMyChats));
router.post("/:chatId/messages", playerAndManagerOnly, expressAdapter(messageController.sendMessage));
router.get("/:chatId/messages", playerAndManagerOnly, expressAdapter(messageController.getMessages));
router.patch("/:messageId/status", playerAndManagerOnly, expressAdapter(messageController.updateStatus));

export default router;
