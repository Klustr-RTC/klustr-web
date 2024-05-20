import { User } from './auth';

export type Message = {
  id: string;
  content: string;
  userId: string;
  user: User;
  roomId: string;
  timeStamp: string;
};
