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
  static getAllRooms = errorHandler(async (query: RoomQueryObject) => {
    const { data } = await api.get(apiRoutes.room.getAll(query));
    return data as Room[];
  });
}
