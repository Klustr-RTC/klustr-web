import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu';
import { Message } from '@/types/message';
import ReactTimeago from 'react-timeago';

type Props = {
  message: Message;
  onDelete: (id: string) => void;
};

const RightMessage = (props: Props) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="flex w-full space-x-3  max-w-md ml-auto justify-end cursor-pointer">
          <div className="grid gap-2">
            <div className="bg-primary grid gap-1 text-primary-foreground backdrop-blur-lg   py-1 px-4 rounded-l-lg rounded-br-lg">
              <p className="text-sm">{props.message.content}</p>
              <span className="text-xs dark:text-foreground text-primary-foreground leading-none text-right float-right">
                <ReactTimeago date={props.message.timeStamp} />
              </span>
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            props.onDelete(props.message.id);
          }}
        >
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default RightMessage;
