import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { CustomButton } from "./CustomButton"
import { Room } from "@/types/room"
import { Dispatch, SetStateAction, useState } from "react"
import { z } from "zod"
import { RoomService } from "@/helpers/RoomService"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { webRoutes } from "@/constants/routes"

interface UpdateRoomProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  roomDetails: Room;
  setRoom: Dispatch<SetStateAction<Room | undefined>>;
}

const schema = z.object({
  name: z.string().min(3, { message: 'Name must be atleast 3 characters' }),
  description: z.string().min(10, { message: 'Description must be atleast 10 characters' }),
  type: z.number().min(0).max(1),
  isPublic: z.boolean(),
  saveMessages: z.boolean()
});

const UpdateRoom = ({ roomDetails, setRoom, isOpen, setIsOpen }: UpdateRoomProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [room, setCurrentRoom] = useState(roomDetails);
  const [disableSaveMessages, setDisableSaveMessages] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const data = schema.safeParse(room);
      if (data.success) {
        const res = await RoomService.updateRoom(room.id, room);
        if (res) {
          toast.success('Room Updated Successfully');
          setRoom(res);
          setIsOpen(false);
          if (roomDetails.type != res.type) {
            if (res.type == 0) {
              navigate(webRoutes.room.chat(res.id));
            } else {
              navigate(webRoutes.room.media(res.id));
            }
          }
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
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <DialogContent className="md:w-3/5 sm:w-4/5 w-full mx-auto p-3 grid gap-5">
        <DialogHeader>
          <DialogTitle>Update Room Details</DialogTitle>
          <DialogDescription>
            Make changes to your room here. Click update when you're done.
          </DialogDescription>
        </DialogHeader>
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
              onChange={e => setCurrentRoom({ ...room, name: e.target.value })}
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
              onChange={e => setCurrentRoom({ ...room, description: e.target.value })}
              placeholder="Enter description"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Room Type</Label>
            <Select
              required
              value={room.type?.toString()}
              onValueChange={value => {
                if (value == '1') {
                  setCurrentRoom({ ...room, saveMessages: false, type: 1 });
                  setDisableSaveMessages(true);
                } else {
                  setCurrentRoom({ ...room, type: 0 });
                  setDisableSaveMessages(false);
                }
              }}
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
                  setCurrentRoom({ ...room, isPublic: val == 'true' ? true : false });
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
                disabled={disableSaveMessages}
                required
                value={
                  room.saveMessages == true
                    ? 'true'
                    : room.saveMessages == false
                      ? 'false'
                      : undefined
                }
                onValueChange={val => {
                  setCurrentRoom({ ...room, saveMessages: val == 'true' ? true : false });
                }}
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
            Update Room
          </CustomButton>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateRoom;
