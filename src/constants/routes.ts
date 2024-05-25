import { RoomQueryObject } from '@/types/room';

export const webRoutes = {
  auth: {
    login: '/auth/login',
    register: '/auth/register'
  },
  home: '/',
  room: {
    create: '/room/create',
    chat: (id: string) => `/room/chat/${id}`,
    media: (id: string) => `/room/media/${id}`
  }
};

export const apiRoutes = {
  account: {
    login: 'account/login',
    register: 'account/register',
    googleAuth: 'account/google-auth',
    findByEmail: (email: string) => `account/findByEmail?email=${email}`
  },
  room: {
    create: 'room',
    delete: (roomId: string) => `room/${roomId}`,
    update: (roomId: string) => `room/${roomId}`,
    getByJoinCode: (joinCode: string) => `room/GetRoomByJoinCode/${joinCode}`,
    getById: (roomId: string) => `room/GetRoomById/${roomId}`,
    generateLink: (roomId: string) => `room/${roomId}/generate-link`,
    getJoinCode: (roomId: string) => `room/${roomId}/GetJoinCode`,
    verifyByJoinCode: (roomId: string, joinCode: string) =>
      `room/${roomId}/verifyJoinCode/${joinCode}`,
    getAll: (query?: RoomQueryObject) => {
      let queryStr = '?';
      if (query?.name) {
        queryStr += `name=${query.name}&`;
      }
      if (query?.description) {
        queryStr += `description=${query.description}&`;
      }
      if (query?.type) {
        queryStr += `type=${query.type}&`;
      }
      if (query?.isPublic) {
        queryStr += `isPublic=${query?.isPublic}`;
      }
      return `room/GetAllRooms${queryStr}`;
    }
  },
  member: {
    create: 'member',
    delete: (memberId: string) => `member/${memberId}`,
    update: (memberId: string) => `member/${memberId}`,
    getByRoomId: (roomId: string) => `member/GetMembersByRoom/${roomId}`
  },
  user: {
    getById: (userId: string) => `user/${userId}`,
    update: `user`,
    delete: 'user'
  },
  message: {
    create: 'chat',
    delete: (id: string) => `chat/${id}`,
    getById: (id: string) => `chat/GetMessageById/${id}`,
    getByRoomId: (roomId: string) => `chat/GetMessagesByRoomId/${roomId}`,
    getByUserId: (userId: string) => `chat/GetMessagesByUserId/${userId}`
  }
};
