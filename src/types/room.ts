export type RoomQueryObject = {
  name?: string;
  description?: string;
  type?: RoomType;
  isPublic?: boolean;
};

export type RoomType = 0 | 1;

export type RoomFormType = {
  name: string;
  description: string;
  type?: RoomType;
  isPublic?: boolean;
  saveMessages?: boolean;
};

export type Room = {
  id: string;
  name: string;
  isPublic: boolean;
  description: string;
  type: RoomType;
  createdBy: string;
  createdOn: string;
  saveMessages: boolean;
  shareableLink: string;
};

export type CreateRoomResponse = {
  room: Room;
  joinCode: string;
};

// map 0 with chatOnly and 1 with AudioVideo
export enum RoomTypeMap {
  chatOnly = 0,
  AudioVideo = 1
}
