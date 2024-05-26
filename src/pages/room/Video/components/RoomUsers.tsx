import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { User } from '@/types/auth';

type RoomUsersProps = {
  users: User[];
  open: boolean;
  setOpen: (open: boolean) => void;
};

const RoomUsers = ({ open, setOpen, users }: RoomUsersProps) => {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Users In Room</SheetTitle>
        </SheetHeader>
        <Separator />
        <ScrollArea className="flex-1 overflow-y-auto ">
          {users.map(user => (
            <div key={user.id} className="flex items-center gap-4 my-3">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src={user.avatar ?? undefined} alt="Avatar" />
                <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">{user.username}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default RoomUsers;
