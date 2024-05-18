import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { webRoutes } from '@/constants/routes';
import { Room } from '@/types/room';
import { LockKeyholeIcon, LockKeyholeOpenIcon, MessageCircle, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TimeAgo from 'react-timeago';

type RoomCardProps = {
  room: Room;
};

export const RoomCard = (props: RoomCardProps) => {
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate(webRoutes.room.room(props.room.id));
  };
  return (
    <>
      <Card
        onClick={() => handleRedirect()}
        className="border cursor-pointer border-muted/50 flex flex-col justify-between"
      >
        <CardHeader>
          <CardTitle className="tracking-wide">{props.room.name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {props.room.description.length > 50
              ? `${props.room.description.substring(0, 50)}...`
              : props.room.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Badge variant="secondary" className="text-sm text-muted-foreground">
              {props.room.type == 0 ? (
                <div className="inline-flex rounded-full gap-1 items-center">
                  <span>Chat-only</span>
                  <MessageCircle size={20} />
                </div>
              ) : (
                <div className="flex gap-1 items-center">
                  <span>Video-Audio</span>
                  <Video size={20} />
                </div>
              )}
            </Badge>
            <br />
            <Badge variant="secondary" className="text-muted-foreground text-xs mt-2">
              <TimeAgo date={props.room.createdOn} />
            </Badge>
            <Badge
              variant={props.room.isPublic ? 'default' : 'destructive'}
              className="absolute bottom-0 right-0 py-1"
            >
              {props.room.isPublic ? (
                <div className="flex gap-1 items-center">
                  <span>Public</span>
                  <LockKeyholeOpenIcon size={15} />
                </div>
              ) : (
                <div className="flex gap-1 items-center">
                  <span>Private</span>
                  <LockKeyholeIcon size={15} />
                </div>
              )}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export const RoomCardSkeleton = () => {
  return (
    <div className="grid gap-4 shadow-sm border border-muted/50 rounded-lg p-3">
      <div className="grid gap-2">
        <Skeleton className="h-7 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
      <div className="grid gap-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  );
};
