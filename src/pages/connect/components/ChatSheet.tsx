import { Separator } from '@/components/ui/separator';
import { SendHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RandomMessage } from '@/types/message';
import { CustomButton } from '@/components/CustomButton';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  messages: RandomMessage[];
  Send: (content: string) => void;
}

function ChatSheet({ open, setOpen, messages, Send }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle>In-room messages</SheetTitle>
            <SheetDescription>This Messages are not saved</SheetDescription>
          </SheetHeader>
          <Separator />
          <ScrollArea className="flex-1 overflow-y-auto ">
            {messages.map((message, index) => (
              <div key={index} className="mt-4">
                <p className="font-bold text-sm">{message.user.username}</p>
                <p className="leading-snug text-sm">{message.content}</p>
              </div>
            ))}
            <div className="mb-2" ref={messagesEndRef} />
          </ScrollArea>
          <footer className=" my-2 flex gap-2 items-center">
            <Input
              onChange={e => setContent(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  setLoading(true);
                  Send(content);
                  setContent('');
                  setLoading(false);
                }
              }}
              className="py-5 flex-1"
              placeholder="Send a message"
              value={content}
            />
            <CustomButton
              onClick={() => {
                setLoading(true);
                Send(content);
                setContent('');
                setLoading(false);
              }}
              variant={'outline'}
              className="size-10"
              size={'icon'}
              loading={loading}
            >
              <SendHorizontal size={20} />
            </CustomButton>
          </footer>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default ChatSheet;
