import { RoomInfo } from '@/components/RoomInfo';
import { MemberWithUser } from '@/types/member';
import { Room } from '@/types/room';
import { useState } from 'react';
import { StartPage } from './StartPage';

type Props = {
  room: Room;
  members: MemberWithUser[];
  setMembers: (members: MemberWithUser[]) => void;
};
export const MediaRoom = ({ room, members, setMembers }: Props) => {
  const [infoOpen, setInfoOpen] = useState(false);
  const [showStartPage, setShowStartPage] = useState(true);
  return (
    <>
      <div className="lg:w-[70%] md:w-[80%] sm:w-[90%] w-full mx-auto ">
        <div className="flex justify-center items-center py-2 bg-transparent sticky top-0 backdrop-blur-lg">
          <h1
            onClick={() => setInfoOpen(true)}
            className="text-2xl cursor-pointer font-semibold text-center"
          >
            {room.name}
          </h1>
        </div>
        {showStartPage ? (
          <StartPage
            onJoin={async () => {
              setShowStartPage(false);
            }}
            room={room}
          />
        ) : (
          <div>welcome to room {room.name}</div>
        )}
      </div>
      <RoomInfo
        setMembers={setMembers}
        room={room}
        members={members}
        open={infoOpen}
        onOpenChange={setInfoOpen}
      />
    </>
  );
};
