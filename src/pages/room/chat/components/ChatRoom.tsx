import { RoomInfo } from '@/components/RoomInfo';
import useKlustrStore from '@/hooks/store';
import { MemberWithUser } from '@/types/member';
import { Message } from '@/types/message';
import { Room } from '@/types/room';
import { useCallback, useEffect, useState } from 'react';
import RightMessage from '../../components/RightChat';
import LeftMessage from '../../components/LeftChat';
import { Input } from '@/components/ui/input';
import { CustomButton } from '@/components/CustomButton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendHorizonal } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';
import { User } from '@/types/auth';
import { MessageService } from '@/helpers/MessageService';
import { HubConnectionState } from '@microsoft/signalr';
import { Loader } from '@/components/Loader';
import { toast } from 'sonner';

type Props = {
  room: Room;
  members: MemberWithUser[];
  setMembers: (members: MemberWithUser[]) => void;
};

export const ChatRoom = ({ room, members, setMembers }: Props) => {
  const [infoOpen, setInfoOpen] = useState(false);
  const userInfo = useKlustrStore(state => state.userInfo);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendMessageLoading, setSendMessageLoading] = useState(false);
  const [content, setContent] = useState('');
  const [, setRoomUsers] = useState<User[]>([]);
  const { connection } = useSocket();

  const handleSendMessage = async () => {
    try {
      setSendMessageLoading(true);
      const res = await MessageService.sendMessage({
        content,
        roomId: room.id,
        userId: userInfo?.id ?? ''
      });
      if (res) {
        setContent('');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSendMessageLoading(false);
    }
  };

  const handleUserJoined = useCallback(
    async (user: { user: User; room: string }) => {
      if (userInfo?.id != user.user.id) {
        toast.success(`${user?.user?.username} join the room`);
      }
      setRoomUsers(prev => {
        if (prev.find(u => u.id === user?.user?.id)) return prev;
        return [...prev, user.user];
      });
    },
    [userInfo?.id]
  );

  const handleSendConnectedUsers = useCallback((users: User[]) => {
    console.log(users);
    setRoomUsers(users);
  }, []);
  const handleReceiveMessage = useCallback((message: Message) => {
    console.log(message);
    setMessages(prev => [...prev, message]);
  }, []);

  const handleUserLeft = useCallback((user: { user: User; room: string }) => {
    toast.success(`${user?.user?.username} left the room`);
    setRoomUsers(prev => prev.filter(u => u.id !== user.user.id));
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await MessageService.getMessagesByRoomId(room.id);
      if (data) {
        setMessages(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [room.id]);

  const joinRoom = useCallback(async () => {
    console.log('current state', connection?.state);
    if (connection?.state === HubConnectionState.Connected) {
      try {
        console.log('joining room');
        await connection.invoke('joinRoom', {
          User: userInfo,
          Room: room.id
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [connection, room.id, userInfo]);

  useEffect(() => {
    joinRoom();
  }, [joinRoom, connection?.state]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    connection.on('ReceiveMessage', handleReceiveMessage);
    connection.on('SendConnectedUsers', handleSendConnectedUsers);
    connection.on('UserJoined', handleUserJoined);
    connection.on('UserLeft', handleUserLeft);

    return () => {
      connection.off('ReceiveMessage');
      connection.off('SendConnectedUsers');
      connection.off('UserJoined');
      connection.off('UserLeft');
    };
  }, [
    connection,
    fetchData,
    handleReceiveMessage,
    handleSendConnectedUsers,
    handleUserJoined,
    handleUserLeft
  ]);

  return (
    <>
      <div
        className="lg:w-[60%] md:w-[70%] sm:w-[80%] w-full mx-auto flex flex-col"
        style={{ height: 'calc(100dvh - 56px)' }}
      >
        <div className="flex z-50 justify-center items-center py-2 bg-transparent sticky top-0  backdrop-blur-lg">
          <h1
            onClick={() => setInfoOpen(true)}
            className="text-2xl cursor-pointer font-semibold text-center"
          >
            {room.name}
          </h1>
        </div>
        <Loader loading={loading} />
        <ScrollArea className="flex-1 overflow-y-auto">
          {!loading && (
            <div className="p-4 space-y-5">
              {messages.map((msg, index) =>
                msg.user.id == userInfo?.id ? (
                  <RightMessage key={index} message={msg} />
                ) : (
                  <LeftMessage key={index} message={msg} />
                )
              )}
            </div>
          )}
        </ScrollArea>
        <div className="flex justify-center items-center py-2 bg-transparent  backdrop-blur-lg gap-2">
          <Input
            value={content}
            onChange={e => setContent(e.target.value)}
            type="text"
            placeholder="Type a message"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <CustomButton
            loading={sendMessageLoading}
            onClick={handleSendMessage}
            size={'icon'}
            variant={'secondary'}
          >
            <SendHorizonal size={20} />
          </CustomButton>
        </div>
      </div>
      <RoomInfo
        setMembers={setMembers}
        room={room}
        members={members}
        open={infoOpen}
        onOpenChange={setInfoOpen}
      />
    </>
  );
};
