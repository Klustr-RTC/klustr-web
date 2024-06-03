import { apiRoutes } from '@/constants/routes';
import { Message, MessageForm } from '@/types/message';
import api from '@/utils/api';
import { errorHandler } from '@/utils/handlers';

export class MessageService {
  static getMessagesByRoomId = errorHandler(async (roomId: string) => {
    const res = await api.get(apiRoutes.message.getByRoomId(roomId));
    return res.data as Message[];
  });
  static sendMessage = errorHandler(async (message: MessageForm) => {
    const res = await api.post(apiRoutes.message.create, message);
    return res.data as Message;
  });

  static deleteMessage = errorHandler(async (id: string) => {
    await api.delete(apiRoutes.message.delete(id));
    return true;
  });
}
