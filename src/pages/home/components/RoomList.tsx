import { Room } from '@/types/room';
import { RoomCard, RoomCardSkeleton } from './RoomCard';

type RoomListProps = {
  rooms: Room[];
  roomLoading: boolean;
};

export const RoomList = (props: RoomListProps) => {
  return (
    <div className="grid gap-3 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
      {props.roomLoading ? (
        <>
          {Array.from({ length: 10 }).map((_, index) => (
            <RoomCardSkeleton key={index} />
          ))}
        </>
      ) : (
        <>
          {props.rooms.map((room, index) => (
            <RoomCard key={index} room={room} />
          ))}
          {props.rooms.length === 0 && <div className="text-center text-muted">No rooms found</div>}
        </>
      )}
    </div>
  );
};
