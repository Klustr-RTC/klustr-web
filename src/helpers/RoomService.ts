import { apiRoutes } from '@/constants/routes';
import { CreateRoomResponse, Room, RoomFormType, RoomQueryObject } from '@/types/room';
import api from '@/utils/api';
import { errorHandler } from '@/utils/handlers';

export class RoomService {
  static createRoom = errorHandler(async (room: RoomFormType) => {
    const { data } = await api.post(apiRoutes.room.create, room);
    return data as CreateRoomResponse;
  });
  static updateRoom = errorHandler(async (roomId: string, room: RoomFormType) => {
    const { data } = await api.put(apiRoutes.room.update(roomId), room);
    return data as Room;
  });
  static deleteRoom = errorHandler(async (roomId: string) => {
    const { data } = await api.delete(apiRoutes.room.delete(roomId));
    return data as string;
  });
  static getRoomByJoinCode = errorHandler(async (joinCode: string) => {
    const { data } = await api.get(apiRoutes.room.getByJoinCode(joinCode));
    return data as Room;
  });
  static getRoomById = errorHandler(async (roomId: string) => {
    const { data } = await api.get(apiRoutes.room.getById(roomId));
    return data as Room;
  });
  static getRoomByLink = errorHandler(async (link: string) => {
    const { data } = await api.get(apiRoutes.room.getByLink(link));
    return data as Room;
  });
  static getAllRooms = errorHandler(async (query?: RoomQueryObject) => {
    const { data } = await api.get(apiRoutes.room.getAll(query));
    return data as Room[];
  });
  static verifyJoinCode = errorHandler(async (joinCode: string, roomId: string) => {
    const { data } = await api.get(apiRoutes.room.verifyByJoinCode(roomId, joinCode));
    return data as Room;
  });
  static generateLink = errorHandler(async (roomId: string) => {
    const { data } = await api.post(apiRoutes.room.generateLink(roomId));
    return data as { shareableLink: string };
  });
  static getJoinCode = errorHandler(async (roomId: string) => {
    const { data } = await api.get(apiRoutes.room.getJoinCode(roomId));
    return data as { joinCode: string };
  });
}
