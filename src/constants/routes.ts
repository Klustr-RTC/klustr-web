import { RoomQueryObject } from '@/types/room';

export const webRoutes = {
  auth: {
    login: '/auth/login',
    register: '/auth/register'
  },
  home: '/',
  room: {
    create: '/room/create',
    room: (id: string) => `/room/${id}`
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
  }
};
