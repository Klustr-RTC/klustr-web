import { MemberWithUser } from '@/types/member';
import { Room } from '@/types/room';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { CustomButton } from './CustomButton';
import { Check, Copy, Loader, Trash2 } from 'lucide-react';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import useKlustrStore from '@/hooks/store';
import { RoomService } from '@/helpers/RoomService';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from './ui/context-menu';
import { MemberService } from '@/helpers/MemberService';
import UpdateRoom from './UpdateRoom';
import { User } from '@/types/auth';
import { useNavigate } from 'react-router-dom';

type Props = {
  room: Room;
  setRoom: Dispatch<SetStateAction<Room | undefined>>;
  members: MemberWithUser[];
  roomUsers?: User[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setMembers: (members: MemberWithUser[]) => void;
};

export const RoomInfo = ({
  room,
  members,
  roomUsers,
  setRoom,
  open,
  onOpenChange,
  setMembers
}: Props) => {
  const userInfo = useKlustrStore(state => state.userInfo);
  const [isUpdate, setIsUpdate] = useState(false);
  const [link, setLink] = useState(`${import.meta.env.VITE_WEB_URL}join/${room.shareableLink}/`);
  const [copied, setCopied] = useState(false);
  const [linkLoading, setLinkLoading] = useState(false);
  const [joinCode, setJoinCode] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  const [member, setMember] = useState<MemberWithUser | null>(
    members.find(member => member.user.id === userInfo?.id) ?? null
  );
  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    toast.success('Link Copied');
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };
  const generateNewLink = async () => {
    if (!confirm('Are you sure to generate new link? Note that Old Link will be invalidated!!'))
      return;
    setLinkLoading(true);
    const res = await RoomService.generateLink(room.id);
    if (res) {
      setLink(`${import.meta.env.VITE_WEB_URL}join/${res.shareableLink}/`);
      toast.success('New Link Generated');
    }
    setLinkLoading(false);
  };

  const fetchJoinCode = useCallback(async () => {
    const res = await RoomService.getJoinCode(room.id);
    if (res) {
      setJoinCode(res.joinCode);
    }
  }, [room.id]);

  const deleteRoom = async () => {
    try {
      setDeleting(true);
      const res = await RoomService.deleteRoom(room.id);
      if (res) {
        toast.success("Room deleted successfully");
        navigate("/");
      }
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setDeleting(false);
    }
  }

  useEffect(() => {
    const m = members.find(member => member.user.id === userInfo?.id) ?? null;
    setMember(m);
    if (m?.isAdmin) {
      fetchJoinCode();
    }
  }, [fetchJoinCode, members, userInfo]);

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>{room.name}</SheetTitle>
            <SheetDescription>{room.description}</SheetDescription>
            {member?.isAdmin && <div className='flex justify-center'>
              <CustomButton onClick={deleteRoom} className='flex items-center gap-1' variant={"destructive"}>
                {
                  deleting ? <Loader className='animate-spin' size={20} /> : <Trash2 size={20} />
                }
                Delete Room
              </CustomButton>
            </div>}
          </SheetHeader>
          <Separator className="my-4" />
          <div className="grid gap-3">
            {member ? (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="join-link">Join Link</Label>
                  <div className="flex gap-1">
                    <Input id="join-link" type="text" value={link} readOnly />
                    <CustomButton
                      onClick={handleCopy}
                      variant={'secondary'}
                      className="size-9"
                      size={'icon'}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </CustomButton>
                  </div>
                  {member.isAdmin ? (
                    <div className="flex items-center gap-4">
                      <CustomButton
                        loading={linkLoading}
                        variant={'default'}
                        onClick={generateNewLink}
                        size={'sm'}
                      >
                        Regenerate Link
                      </CustomButton>
                      <CustomButton
                        onClick={() => setIsUpdate(true)}
                        size={'sm'}
                        variant={'outline'}
                        className="flex items-center gap-2"
                      >
                        <span>Edit Room Details</span>
                      </CustomButton>
                    </div>
                  ) : null}
                  {joinCode ? (
                    <>
                      <Separator className="my-2" />
                      <div className="flex justify-between">
                        <span>Join Code</span>
                        <span>:</span> {joinCode} <span></span>
                      </div>
                      <Separator className="my-2" />
                    </>
                  ) : null}
                </div>
              </>
            ) : null}
            {members.length > 0 && (
              <div className="grid gap-3">
                <h2 className="text-xl font-semibold">Members</h2>
                <div className="grid gap-8">
                  {members.map(m => (
                    <MemberCard
                      key={m.id}
                      currentMember={member}
                      onChange={(item: MemberWithUser) => {
                        const index = members.findIndex(member => member.id === item.id);
                        members[index] = item;
                        setMembers([...members]);
                      }}
                      onDelete={() => {
                        const index = members.findIndex(member => member.id === m.id);
                        members.splice(index, 1);
                        setMembers([...members]);
                      }}
                      member={m}
                    />
                  ))}
                </div>
              </div>
            )}
            {roomUsers && (
              <div className="grid gap-3 my-3">
                <h2 className="text-xl font-semibold">Live Users</h2>
                <div className="grid gap-5">
                  {roomUsers.map(user => (
                    <div key={user.id} className="flex items-center gap-4">
                      <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">{user.username}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  ))}
                  {roomUsers.length === 0 && <p>No Live Users</p>}
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
      <UpdateRoom isOpen={isUpdate} setIsOpen={setIsUpdate} roomDetails={room} setRoom={setRoom} />
    </>
  );
};

const MemberCard = ({
  member,
  onChange,
  onDelete,
  currentMember
}: {
  member: MemberWithUser;
  currentMember: MemberWithUser | null;
  onChange: (member: MemberWithUser) => void;
  onDelete: () => void;
}) => {
  const handleRoleChange = async () => {
    const token = toast.loading('Updating Role');
    if (member.isAdmin) {
      const res = await MemberService.removeAdmin(member.id);
      if (res) {
        onChange({ ...member, isAdmin: false });
        toast.success('Role Updated');
      }
      toast.dismiss(token);
    } else {
      const res = await MemberService.makeAdmin(member.id);
      if (res) {
        onChange({ ...member, isAdmin: true });
        toast.success('Role Updated');
      }
      toast.dismiss(token);
    }
  };
  const handleDelete = async () => {
    const token = toast.loading('Deleting Member');
    const res = await MemberService.removeMember(member.id);
    if (res) {
      onDelete();
      toast.success('Member Deleted');
    }
    toast.dismiss(token);
  };
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src={member.user.avatar} alt={member.user.username} />
            <AvatarFallback>{member.user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">{member.user.username}</p>
            <p className="text-sm text-muted-foreground">{member.user.email}</p>
          </div>
          <div className="ml-auto font-medium">
            {member.isAdmin ? <Badge>Admin</Badge> : <Badge>Member</Badge>}
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {currentMember && currentMember.isAdmin ? (
          <>
            <ContextMenuItem
              onClick={() => {
                handleRoleChange();
              }}
            >
              {member.isAdmin ? 'Remove Admin' : 'Make Admin'}
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleDelete()}>Delete Member</ContextMenuItem>
          </>
        ) : member.userId === currentMember?.userId ? (
          <ContextMenuItem onClick={() => handleDelete()}>Delete Member</ContextMenuItem>
        ) : null}
      </ContextMenuContent>
    </ContextMenu>
  );
};
