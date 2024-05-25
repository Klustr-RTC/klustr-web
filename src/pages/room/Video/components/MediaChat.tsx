import { Room } from '@/types/room';
import { Separator } from '@/components/ui/separator'
import { SendHorizonal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Props {
  room: Room,
  setOpen: (open: boolean) => void;
}

const dummyArray = [
  { username: "user1", content: "Lorem ipsum" },
  { username: "user2", content: "Sed do eiusmod tempor incididunt" },
  { username: "user3", content: "Ut enim ad minim veniam, quis nostrud" },
  { username: "user3", content: "Ut enim ad minim veniam, quis nostrud" },
  { username: "user3", content: "Ut enim ad minim veniam, quis nostrud" },
  { username: "user3", content: "Ut enim ad minim veniam, quis nostrud" },
  { username: "user4", content: "Duis aute irure dolor in reprehenderit" },
  { username: "user4", content: "Duis aute irure dolor in reprehenderit" },
  { username: "user4", content: "Duis aute irure dolor in reprehenderit" },
  { username: "user4", content: "Duis aute irure dolor in reprehenderit" },
  { username: "user4", content: "Duis aute irure dolor in reprehenderit" },
  { username: "user4", content: "Duis aute irure dolor in reprehenderit" },
  { username: "user4", content: "Duis aute irure dolor in reprehenderit" },
  { username: "user4", content: "Duis aute irure dolor in reprehenderit" },
  { username: "user4", content: "Duis aute irure dolor in reprehenderit" },
  { username: "user4", content: "Duis aute irure dolor in reprehenderit" },
  { username: "user4", content: "Duis aute irure dolor in reprehenderit" },
];


function MediaChat({ room, setOpen }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [dummyArray]);
  return (
    <div className='flex flex-col text-secondary bg-secondary-foreground w-2/5 rounded-lg'>
      <header className='mx-3 px-3 mt-2 py-2 sticky top-0'>
        <div className='flex justify-between'>
          <p className='text-lg font-bold'>In-room messages</p>
          <X className='cursor-pointer' onClick={() => setOpen(false)} />
        </div>
        <p className='font-semibold text-gray-600'>Admin has {room.saveMessages ? "allowed" : "not allowed"} saving messages </p>
      </header>
      <Separator className='my-2' />
      <ScrollArea className="flex-1 overflow-y-auto mx-3 px-3">
        {
          dummyArray.map((message, index) => (
            <div key={index} className='mt-4'>
              <p className='font-bold text-sm'>{message.username}</p>
              <p className='leading-snug text-sm'>{message.content}</p>
            </div>
          ))
        }
        <div className='mb-2' ref={messagesEndRef} />
      </ScrollArea>
      <footer className='mx-3 my-2 sticky top-0 flex items-center'>
        <Input className='py-5 rounded-full' placeholder='Send a message' />
        <SendHorizonal className='absolute right-2 text-gray-600 cursor-pointer' size={20} />
      </footer>
    </div>
  )
}

export default MediaChat
