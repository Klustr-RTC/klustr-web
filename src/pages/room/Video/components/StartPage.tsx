import { CustomButton } from '@/components/CustomButton';
import { Room } from '@/types/room';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Props = {
  onJoin: () => Promise<void>;
  room: Room;
};
export const StartPage = (props: Props) => {
  const { room } = props;
  const [config, setConfig] = useState({
    audio: true,
    video: true
  });
  const [joining, setJoining] = useState(false);
  const [permission, setPermission] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<MediaStreamTrack | null>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<MediaStreamTrack | null>(null);

  const startVideo = async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (!localStream) {
        setPermission(false);
        return;
      }
      setPermission(true);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }
      setLocalAudioTrack(localStream.getAudioTracks()[0]);
      setLocalVideoTrack(localStream.getVideoTracks()[0]);
    } catch (error) {
      setPermission(false);
      console.log(error);
    }
  };
  useEffect(() => {
    startVideo();
  }, [localVideoRef]);

  return (
    <div className="w-full p-4 flex max-sm:flex-col gap-3">
      <div className="sm:w-[60%] w-full">
        {!config.video || !permission ? (
          <div className="w-full aspect-video dark:bg-neutral-950 bg-neutral-200 rounded-lg flex justify-center items-center">
            <div className="dark:bg-neutral-900 bg-neutral-300 rounded-full p-2">
              <VideoOff size={30} />
            </div>
          </div>
        ) : (
          <video ref={localVideoRef} autoPlay playsInline muted className="rounded-lg w-full" />
        )}
      </div>
      <div className="sm:w-[40%] w-full  p-3  flex flex-col gap-3">
        <h2 className="text-center md:text-2xl sm:text-xl text-lg font-semibold">
          Join Room : {room.name}
        </h2>
        <div className="flex gap-3 items-center justify-center">
          <CustomButton
            onClick={() => {
              setConfig({ ...config, audio: !config.audio });
            }}
            size={'icon'}
            variant={'secondary'}
            className="rounded-full size-12"
          >
            {config.audio ? <Mic size={24} /> : <MicOff size={24} />}
          </CustomButton>
          <CustomButton
            onClick={() => {
              if (config.video) {
                localVideoTrack?.stop();
              } else {
                startVideo();
              }
              setConfig({ ...config, video: !config.video });
            }}
            size={'icon'}
            variant={'secondary'}
            className="rounded-full size-12"
          >
            {config.video ? <Video size={24} /> : <VideoOff size={24} />}
          </CustomButton>
        </div>
        <CustomButton
          onClick={async () => {
            setJoining(true);
            await props.onJoin();
            setJoining(false);
          }}
          loading={joining}
          size={'lg'}
        >
          Join Room
        </CustomButton>
      </div>
    </div>
  );
};
