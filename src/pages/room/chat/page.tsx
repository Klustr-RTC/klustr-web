import { Loader } from '@/components/Loader';
import { webRoutes } from '@/constants/routes';
import { MemberService } from '@/helpers/MemberService';
import { RoomService } from '@/helpers/RoomService';
import useKlustrStore from '@/hooks/store';
import { MemberWithUser } from '@/types/member';
import { Room } from '@/types/room';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckJoinCode } from '@/components/CheckJoinCode';
import { ChatRoom } from './components/ChatRoom';
import { toast } from 'sonner';

export const ChatRoomPage = () => {
  const [room, setRoom] = useState<Room>();
  const [isJoinable, setIsJoinable] = useState(false);
  const [members, setMembers] = useState<MemberWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const userInfo = useKlustrStore(state => state.userInfo);
  const navigate = useNavigate();
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
            setMembers(members);
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
    <div>
      <Loader loading={loading} />
      {!loading ? (
        room && isJoinable ? (
          <ChatRoom setMembers={setMembers} room={room} members={members} />
        ) : (
          <CheckJoinCode onJoinCode={handleJoinCode} />
        )
      ) : null}
    </div>
  );
};
