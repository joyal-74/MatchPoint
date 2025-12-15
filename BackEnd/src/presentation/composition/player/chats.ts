import { ChatController } from 'presentation/http/controllers/player/ChatController';
import { GetChatsUseCase } from 'app/usecases/player/chat/GetChatsUsecase';
import { chatRepository } from '../shared/repositories';

// Use cases
const getChatsUC = new GetChatsUseCase(chatRepository);

// Controller
export const playerChatController = new ChatController(
    getChatsUC,
);