import { User } from './auth';

export type CreateMemberType = {
  userId: string;
  roomId: string;
  isAdmin: boolean;
};

export type Member = {
  id: string;
  userId: string;
  roomId: string;
  isAdmin: boolean;
};

export type MemberWithUser = {
  id: string;
  userId: string;
  roomId: string;
  isAdmin: boolean;
  user: User;
};
