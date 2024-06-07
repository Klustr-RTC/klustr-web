import { CustomButton } from '@/components/CustomButton';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import useKlustrStore from '@/hooks/store';
import LeftMessage from '@/pages/room/components/LeftChat';
import RightMessage from '@/pages/room/components/RightChat';
import { RandomMessage } from '@/types/message';
import { SendHorizonal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Props = {
  messages: RandomMessage[];
  sendMessage: (content: string) => void;
};

function Chat({ messages, sendMessage }: Props) {
  const userInfo = useKlustrStore(state => state.userInfo);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
  };

  const handleSendMessage = () => {
    if (content.trim() === '') return;
    sendMessage(content);
    setContent('');
  };

  useEffect(() => {
    scrollToBottom();
  }, []);
  return (
    <div className="w-full flex flex-col flex-1">
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-5">
          {messages.map((msg, index) =>
            msg.user.id == userInfo?.id ? (
              <RightMessage key={index} message={msg} />
            ) : (
              <LeftMessage key={index} message={msg} />
            )
          )}
        </div>
        <div className="mb-2" ref={messagesEndRef} />
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
        <CustomButton onClick={handleSendMessage} size={'icon'} variant={'secondary'}>
          <SendHorizonal size={20} />
        </CustomButton>
      </div>
    </div>
  );
}

export default Chat;
