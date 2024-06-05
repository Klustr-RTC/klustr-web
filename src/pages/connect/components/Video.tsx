import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/auth";
import { MicOff } from "lucide-react";
import { useEffect, useRef } from "react";

type VideoProps = {
  stream?: MediaStream;
  user: User;
  isMuted?: boolean;
  config: { audio: boolean; video: boolean };
};

const Video = ({ stream, user, isMuted, config }: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const play = async () => {
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    };
    play();
  }, [stream]);
  console.log(user)
  return (
    <div
      className={`relative flex justify-center items-center h-full ${isMuted || !config.audio ? '' : 'border-2 border-violet-600'
        }`}
    >
      <video
        ref={videoRef}
        muted={isMuted || !config.audio}
        className={`${config.video ? '' : 'hidden'} h-full w-full object-cover`}
      />
      {!config.audio && (
        <div className="bg-black opacity-30 z-50 rounded-full p-1 absolute top-3 right-3 flex items-center space-x-2">
          <MicOff size={18} className="text-white" />
        </div>
      )}
      {!config.video && (
        <div className="h-full w-full   flex items-center justify-center dark:bg-neutral-900 bg-neutral-200">
          <Avatar className={`w-[120px] h-[120px]`}>
            <AvatarImage src={user?.avatar} className="object-cover overflow-visible" />
            <AvatarFallback>{user?.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      )}
      <p className="absolute bottom-2 left-2 font-semibold">{user.username}</p>
    </div>
  )
}

export default Video
