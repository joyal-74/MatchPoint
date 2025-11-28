import { chatRepository, messageRepository } from '../shared/repositories';
import { MessageController } from 'presentation/http/controllers/player/MessageController';
import { UpdateMessageStatusUseCase } from 'app/usecases/player/chat/UpdateMessageStatusUseCase';
import { SendMessageUseCase } from 'app/usecases/player/chat/SendMessageUseCase';
import { GetMessagesUseCase } from 'app/usecases/player/chat/GetMessagesUseCase';

// Use cases
const sendMessagesUC = new SendMessageUseCase(messageRepository, chatRepository);
const getMessagesUC = new GetMessagesUseCase(messageRepository);
const updateStatusUC = new UpdateMessageStatusUseCase(messageRepository);


// Controller
export const messageController = new MessageController(
    sendMessagesUC,
    getMessagesUC,
    updateStatusUC
);
