import { useEffect, useState } from 'react';
import { HomeHeader } from './components/HomeHeader';
import { RoomList } from './components/RoomList';
import { RoomService } from '@/helpers/RoomService';
import { Room } from '@/types/room';

export const Home = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomLoading, setRoomLoading] = useState(true);
  const fetchRooms = async () => {
    try {
      setRoomLoading(true);
      const res = await RoomService.getAllRooms();
      if (res) {
        setRooms(res);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setRoomLoading(false);
      }, 1000);
    }
  };
  useEffect(() => {
    fetchRooms();
  }, []);
  return (
    <div className="flex flex-col sm:px-10 gap-8">
      <HomeHeader />
      <RoomList rooms={rooms} roomLoading={roomLoading} />
    </div>
  );
};
