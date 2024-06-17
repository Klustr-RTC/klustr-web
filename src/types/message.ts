import { User } from './auth';

export type Message = {
  id: string;
  content: string;
  userId: string;
  user: User;
  roomId: string;
  timeStamp: string;
};

export type RandomMessage = {
  content: string;
  user: User;
  timeStamp: string;
};

export type MessageForm = {
  content: string;
  userId: string;
  roomId: string;
};
