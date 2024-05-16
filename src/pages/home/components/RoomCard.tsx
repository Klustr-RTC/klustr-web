import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { webRoutes } from '@/constants/routes';
import { Room } from '@/types/room';
import { useNavigate } from 'react-router-dom';
import TimeAgo from 'react-timeago';

type RoomCardProps = {
  room: Room;
};

export const RoomCard = (props: RoomCardProps) => {
  const navigate = useNavigate();
  return (
    <>
      <Card
        onClick={() => navigate(webRoutes.room.room(props.room.id))}
        className="border cursor-pointer border-muted/50"
      >
        <CardHeader>
          <CardTitle>{props.room.name}</CardTitle>
          <CardDescription className="line-clamp-2">{props.room.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="text-muted-foreground">
              Created : <TimeAgo date={props.room.createdOn} />
            </div>
            <div className="text-muted-foreground">
              Type : {props.room.type == 0 ? 'Chat' : 'Audio/Video'}
            </div>
            <Badge className="absolute bottom-0 right-0">
              {props.room.isPublic ? 'Public' : 'Private'}
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
