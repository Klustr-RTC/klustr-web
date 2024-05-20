import { RoomInfo } from '@/components/RoomInfo';
import useKlustrStore from '@/hooks/store';
import { MemberWithUser } from '@/types/member';
import { Message } from '@/types/message';
import { Room } from '@/types/room';
import { useState } from 'react';
import RightMessage from '../../components/RightChat';
import LeftMessage from '../../components/LeftChat';
import { Input } from '@/components/ui/input';
import { CustomButton } from '@/components/CustomButton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendHorizonal } from 'lucide-react';

type Props = {
  room: Room;
  members: MemberWithUser[];
  setMembers: (members: MemberWithUser[]) => void;
};
const randomMessages = [
  {
    id: '1',
    content: 'Hello how are you doing? can you help me with something? I am stuck at something.',
    userId: '1',
    user: {
      id: '2',
      username: 'John Doe',
      email: 'nilesh@gmail.com'
    },
    roomId: '1',
    timeStamp: '2021-08-16T14:00:00'
  },
  {
    id: '2',
    content:
      'Yes sure, what do you need help with? I am here to help you. I will do my best to help you.',
    userId: '2',
    user: {
      id: '2',
      username: 'John Doe',
      email: 'nilesh@gmail.com'
    },
    roomId: '1',
    timeStamp: '2021-08-16T14:01:00'
  },
  {
    id: '2',
    content:
      'Yes sure, what do you need help with? I am here to help you. I will do my best to help you.',
    userId: '2',
    user: {
      id: '2',
      username: 'John Doe',
      email: 'nilesh@gmail.com'
    },
    roomId: '1',
    timeStamp: '2021-08-16T14:01:00'
  },
  {
    id: '2',
    content:
      'Yes sure, what do you need help with? I am here to help you. I will do my best to help you.',
    userId: '2',
    user: {
      id: '2',
      username: 'John Doe',
      email: 'nilesh@gmail.com'
    },
    roomId: '1',
    timeStamp: '2021-08-16T14:01:00'
  },
  {
    id: '3',
    content: 'How are you?',
    userId: '1',
    roomId: '1',
    user: {
      id: '2',
      username: 'John Doe',
      email: 'nilesh@gmail.com'
    },
    timeStamp: '2021-08-16T14:02:00'
  },
  {
    id: '3',
    content: 'How are you?',
    userId: '1',
    roomId: '1',
    user: {
      id: '2',
      username: 'John Doe',
      email: 'nilesh@gmail.com'
    },
    timeStamp: '2021-08-16T14:02:00'
  },
  {
    id: '3',
    content: 'How are you?',
    userId: '1',
    roomId: '1',
    user: {
      id: '2',
      username: 'John Doe',
      email: 'nilesh@gmail.com'
    },
    timeStamp: '2021-08-16T14:02:00'
  },
  {
    id: '3',
    content: 'How are you?',
    userId: '1',
    roomId: '1',
    user: {
      id: '2',
      username: 'John Doe',
      email: 'nilesh@gmail.com'
    },
    timeStamp: '2021-08-16T14:02:00'
  },
  {
    id: '3',
    content: 'How are you?',
    userId: '1',
    roomId: '1',
    user: {
      id: '2',
      username: 'John Doe',
      email: 'nilesh@gmail.com'
    },
    timeStamp: '2021-08-16T14:02:00'
  },
  {
    id: '4',
    content: 'I am fine',
    userId: '2',
    user: {
      id: '2',
      username: 'John Doe',
      email: 'nilesh@gmail.com'
    },
    roomId: '1',
    timeStamp: '2021-08-16T14:03:00'
  }
];
export const ChatRoom = ({ room, members, setMembers }: Props) => {
  const [infoOpen, setInfoOpen] = useState(false);
  const userInfo = useKlustrStore(state => state.userInfo);
  const [messages] = useState<Message[]>(randomMessages);

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
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-5">
            {messages.map((msg, index) =>
              index % 2 ? (
                <RightMessage key={index} message={msg} />
              ) : (
                <LeftMessage key={index} message={msg} />
              )
            )}
          </div>
        </ScrollArea>
        <div className="flex justify-center items-center py-2 bg-transparent  backdrop-blur-lg gap-2">
          <Input type="text" placeholder="Type a message" />
          <CustomButton size={'icon'} variant={'secondary'}>
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
