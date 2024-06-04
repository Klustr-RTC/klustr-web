import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { User } from '@/types/auth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { MemberService } from '@/helpers/MemberService';
import { Room } from '@/types/room';
import { toast } from 'sonner';
import { MemberWithUser } from '@/types/member';
import { UserService } from '@/helpers/UserService';
import { Loader2, Plus } from 'lucide-react';
import { CustomButton } from './CustomButton';

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  room: Room;
  members: MemberWithUser[];
  onAddMember: (member: MemberWithUser) => void;
};

const AddMember = (props: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const addMember = async (id: string) => {
    setLoading(true);
    const res = await MemberService.createMember({
      roomId: props.room.id,
      userId: id,
      isAdmin: false
    });
    if (res) {
      props.onAddMember(res);
      toast.success('Member added successfully');
      props.setIsOpen(false);
    }
    setLoading(false);
  };
  const fetchUsers = async (query: string) => {
    setFetching(true);
    const res = await UserService.findUsers(query);
    if (res) {
      setUsers(res);
    }
    setFetching(false);
  };
  return (
    <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
      <DialogContent>
        {loading && (
          <div className="absolute bg-background/70 z-30 top-0 bottom-0 right-0 left-0 flex flex-col justify-center items-center">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
        )}
        <DialogHeader>
          <DialogTitle>Add Member to Room</DialogTitle>
          <DialogDescription>
            Member can see shareableLink and joinCode of the room
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="flex gap-3 items-center">
            <Input
              type="text"
              placeholder="Search user..."
              onChange={e => {
                if (e.target.value.trim().length < 3) {
                  setUsers([]);
                  return;
                }
                fetchUsers(e.target.value.trim());
              }}
            />
            {fetching && <Loader2 className="w-6 h-6 animate-spin" />}
          </div>
          {users.map(user => {
            if (props.members.find(member => member.userId === user.id)) {
              return null;
            }
            return (
              <div key={user.id} className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">{user.username}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <CustomButton
                  size={'icon'}
                  className="ml-auto"
                  onClick={async () => {
                    if (loading) return;
                    await addMember(user.id);
                  }}
                >
                  <Plus className="w-5 h-5" />
                </CustomButton>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMember;
