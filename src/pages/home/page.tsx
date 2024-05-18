import { useEffect, useState } from 'react';
import { HomeHeader } from './components/HomeHeader';
import { RoomList } from './components/RoomList';
import { RoomService } from '@/helpers/RoomService';
import { Room, RoomQueryObject } from '@/types/room';
import { toast } from 'sonner';

export const Home = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomLoading, setRoomLoading] = useState(true);
  const [filtered, setFiltered] = useState(false);

  const onFilter = async (query: RoomQueryObject) => {
    try {
      const res = await RoomService.getAllRooms(query);
      if (res) {
        setRooms(res);
        if (Object.keys(query).length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (Object.keys(query).every(key => (query as any)[key] == undefined)) {
            setFiltered(false);
          } else {
            setFiltered(true);
          }
        } else {
          setFiltered(false);
        }
        toast.success('Rooms filtered successfully');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRooms = async () => {
    try {
      setRoomLoading(true);
      const res = await RoomService.getAllRooms();
      if (res) {
        setRooms(res);
        setFiltered(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setRoomLoading(false);
    }
  };
  useEffect(() => {
    fetchRooms();
  }, []);
  return (
    <div className="flex flex-col sm:px-10 gap-8">
      <HomeHeader filtered={filtered} onClear={fetchRooms} onFilter={onFilter} />
      <RoomList rooms={rooms} roomLoading={roomLoading} />
    </div>
  );
};
