import { Message } from '@/types/message';
import ReactTimeago from 'react-timeago';

type Props = {
  message: Message;
};

const LeftMessage = (props: Props) => {
  return (
    <div className="flex w-full space-x-3  max-w-md mr-auto justify-start cursor-pointer">
      <div className="grid gap-2">
        <div className="dark:bg-background/80 bg-neutral-300/60 grid gap-1 text-card-foreground backdrop-blur-lg   py-1 px-4 rounded-r-lg rounded-bl-lg">
          <span className="text-sm text-primary font-semibold leading-none text-left float-left">
            {props.message.user.username}
          </span>
          <p className="text-sm">{props.message.content}</p>
          <span className="text-xs text-muted-foreground leading-none -mt-1 text-right float-right">
            <ReactTimeago date={props.message.timeStamp} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default LeftMessage;
