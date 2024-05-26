import { Loader } from '@/components/Loader';
import { webRoutes } from '@/constants/routes';
import { MemberService } from '@/helpers/MemberService';
import { RoomService } from '@/helpers/RoomService';
import useKlustrStore from '@/hooks/store';
import { MemberWithUser } from '@/types/member';
import { Room } from '@/types/room';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MediaRoom } from './components/MediaRoom';
import { CheckJoinCode } from '@/components/CheckJoinCode';
import { toast } from 'sonner';
import { SocketProvider } from '@/hooks/useSocket';

export const VideoRoomPage = () => {
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState<Room>();
  const [isJoinable, setIsJoinable] = useState(false);
  const [members, setMembers] = useState<MemberWithUser[]>([]);
  const navigate = useNavigate();
  const userInfo = useKlustrStore(state => state.userInfo);
  const { id } = useParams();

  const fetchRoom = async () => {
    try {
      if (!id) {
        return;
      }
      if (!userInfo) {
        navigate(webRoutes.auth.login);
        return;
      }
      const [res, members] = await Promise.all([
        RoomService.getRoomById(id),
        MemberService.getMembersByRoomId(id)
      ]);

      if (res) {
        setRoom(res);
        setMembers(members ?? []);
        if (res.isPublic) {
          setIsJoinable(true);
        } else {
          // check if user has permission to join
          if (members) {
            setIsJoinable(true);
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleJoinCode = async (code: string) => {
    try {
      const res = await RoomService.verifyJoinCode(code, id!);
      if (res) {
        setIsJoinable(true);
        toast.success('Join Code Verified');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRoom();
  }, []);
  return (
    <SocketProvider>
      <div className="flex-1 flex flex-col">
        <Loader loading={loading} />
        {!loading ? (
          room && isJoinable ? (
            <MediaRoom setMembers={setMembers} room={room} members={members} />
          ) : (
            <CheckJoinCode onJoinCode={handleJoinCode} />
          )
        ) : null}
      </div>
    </SocketProvider>
  );
};
