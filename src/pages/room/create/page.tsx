import { CustomButton } from '@/components/CustomButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { webRoutes } from '@/constants/routes';
import { RoomService } from '@/helpers/RoomService';
import { RoomFormType } from '@/types/room';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import z from 'zod';
const RoomIV: RoomFormType = {
  name: '',
  description: ''
};

const schema = z.object({
  name: z.string().min(3, { message: 'Name must be atleast 3 characters' }),
  description: z.string().min(10, { message: 'Description must be atleast 10 characters' }),
  type: z.number().min(0).max(1),
  isPublic: z.boolean(),
  saveMessages: z.boolean()
});

export const CreateRoom = () => {
  const [room, setRoom] = useState<RoomFormType>(RoomIV);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const data = schema.safeParse(room);
      if (data.success) {
        const res = await RoomService.createRoom(room);
        if (res) {
          toast.success('Room Created Successfully');
          setRoom(RoomIV);
          navigate(webRoutes.room.room(res.room.id));
        }
      } else {
        data.error.errors.forEach(error => {
          toast.warning(error.message);
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="md:w-3/5 sm:w-4/5 w-full mx-auto p-3 grid gap-5">
      <h1 className="text-3xl font-semibold">Create Room</h1>
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSubmit();
        }}
        className="grid gap-5"
      >
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={room.name}
            onChange={e => setRoom({ ...room, name: e.target.value })}
            type="text"
            placeholder="Enter Name"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="desc">Description</Label>
          <Textarea
            id="desc"
            value={room.description}
            onChange={e => setRoom({ ...room, description: e.target.value })}
            placeholder="Enter description"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="type">Room Type</Label>
          <Select
            required
            value={room.type?.toString()}
            onValueChange={value => setRoom({ ...room, type: value == '0' ? 0 : 1 })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Room type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={'0'}>Chat Only</SelectItem>
              <SelectItem value={'1'}>Audio/Video</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="type">Visibility</Label>
            <Select
              required
              value={room.isPublic ? 'true' : room.isPublic == false ? 'false' : undefined}
              onValueChange={val => {
                setRoom({ ...room, isPublic: val == 'true' ? true : false });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={'true'}>Public</SelectItem>
                <SelectItem value={'false'}>Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Save Messages?</Label>
            <Select
              value={
                room.saveMessages == true
                  ? 'true'
                  : room.saveMessages == false
                  ? 'false'
                  : undefined
              }
              onValueChange={val => {
                setRoom({ ...room, saveMessages: val == 'true' ? true : false });
              }}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="save Messages?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={'true'}>Yes</SelectItem>
                <SelectItem value={'false'}>No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <CustomButton loading={submitting} type="submit">
          Create Room
        </CustomButton>
      </form>
    </div>
  );
};
