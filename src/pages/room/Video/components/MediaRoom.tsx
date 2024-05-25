import { RoomInfo } from '@/components/RoomInfo';
import { MemberWithUser } from '@/types/member';
import { Room } from '@/types/room';
import { useEffect, useRef, useState } from 'react';
import { StartPage } from './StartPage';
import { Info, MessageSquareText, Mic, MicOff, Users, Video, VideoOff } from 'lucide-react';
import MediaChat from './MediaChat';

type Props = {
  room: Room;
  members: MemberWithUser[];
  setMembers: (members: MemberWithUser[]) => void;
};
export const MediaRoom = ({ room, members, setMembers }: Props) => {
  const [infoOpen, setInfoOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [showStartPage, setShowStartPage] = useState(true);
  const localVideoRefs = useRef<HTMLVideoElement[]>([]);
  const numVideos = members?.length;
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);

  useEffect(() => {
    if (!showStartPage) {
      startLocalVideo(); // Start your local video when the start page is hidden
    }
  }, [showStartPage]);

  const startLocalVideo = async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localStream) {
        for (let i = 0; i < numVideos; i++) {
          if (localVideoRefs.current[i] && localStream) {
            localVideoRefs.current[i].srcObject = localStream;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col m-auto h-[calc(100vh-56px)]">
        <div className='h-[calc(100%-80px)] flex'>
          <div className='w-full'>
            {/* Title Header  */}
            <div onClick={() => setInfoOpen(true)} className="z-10 cursor-pointer flex justify-center items-center py-2 bg-muted sticky top-0 backdrop-blur-lg border-b-[1px]">
              <h1
                className="text-2xl font-semibold text-center"
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
              <>
                {/* Video Area */}
                <div className="flex flex-wrap justify-center items-center gap-4 h-[70vh] 2xl:h-[80vh] w-full">
                  <div>
                    {members.map((member, index) => (
                      <div key={index}
                        className={`rounded-lg  relative
                    ${numVideos == 1 ? 'h-full w-[80%] m-auto' :
                            numVideos == 2 ? 'w-[calc(50%-1rem)]' :
                              numVideos >= 3 ? 'w-[calc(50%-1rem)] h-[calc(50%-1rem)]' : ''
                          }
                  `}
                      >
                        <video
                          key={index}
                          ref={(element) => {
                            localVideoRefs.current[index] = element!;
                          }}
                          autoPlay
                          playsInline
                          muted// Mute all videos except the first one
                          className="rounded-lg w-full border-4 border-primary h-full object-cover"
                        />
                        <div className="bg-black opacity-30 rounded-full p-1 absolute top-3 right-3 flex items-center space-x-2">
                          <MicOff size={18} className="text-white" />
                        </div>
                        <div className="text-[#fcfbf8] px-2 rounded-full p-1 absolute bottom-1 left-3 flex items-center space-x-2">
                          <p className='font-bold'>{member?.user?.username}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>)}
          </div>
          {chatOpen && <MediaChat
            room={room}
            setOpen={setChatOpen}
          />
          }
        </div>
        {/* Media Controls */}
        {!showStartPage && <div className="flex items-center justify-center py-4 gap-10">
          <div onClick={() => setIsMicOn(!isMicOn)} className={`cursor-pointer p-3 rounded-full ${!isMicOn ? 'bg-primary text-white' : 'bg-muted'}`}>
            {isMicOn ? <Mic /> : <MicOff />}
          </div>
          <div onClick={() => setIsVideoOn(!isVideoOn)} className={`cursor-pointer p-3 rounded-full ${!isVideoOn ? 'bg-primary text-white' : 'bg-muted'}`}>
            {isVideoOn ? <Video /> : <VideoOff />}
          </div>
          <div className="relative cursor-pointer p-3 bg-muted rounded-full">
            <Users />
            <span className='bg-secondary rounded-full text-sm px-1 absolute top-0 right-0'>{members.length}</span>
          </div>
          <div onClick={() => setChatOpen(!chatOpen)} className={`${chatOpen && 'text-primary'} relative cursor-pointer p-3 bg-muted rounded-full`}>
            <MessageSquareText />
            <span className="w-2 h-2 border-white border-[1px] bg-red-500 rounded-full absolute top-3 right-3"></span>
          </div>
          <div className={`${infoOpen && 'text-primary'} cursor-pointer p-3 bg-muted rounded-full`} onClick={() => setInfoOpen(!infoOpen)}>
            <Info />
          </div>
        </div>}

      </div >
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