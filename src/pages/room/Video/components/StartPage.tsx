import { CustomButton } from '@/components/CustomButton';
import { Room, VideoConfig } from '@/types/room';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Props = {
  onJoin: (config: { audio: boolean; video: boolean }) => Promise<void>;
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
  const [gettingStream, setGettingStream] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const clearStream = (stream: MediaStream) => {
    console.log('Clearing Stream');
    stream.getAudioTracks().forEach(track => {
      track.stop();
      track.enabled = false;
    });
    stream.getVideoTracks().forEach(track => {
      track.stop();
      track.enabled = false;
    });
  };
  const startVideo = async (config: VideoConfig) => {
    if (gettingStream) {
      return undefined;
    }
    try {
      setGettingStream(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: config.video
          ? {
              facingMode: 'user',
              aspectRatio: 4 / 3
            }
          : false,
        audio: config.audio
      });

      console.log('getting stream');
      if (!stream) {
        setPermission(false);
        return;
      }
      setPermission(true);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play();
      }
      if (localStream) {
        clearStream(localStream);
      }
      setLocalStream(stream);
      setGettingStream(false);
      return {
        audio: stream.getAudioTracks()[0],
        video: stream.getVideoTracks()[0]
      };
    } catch (error) {
      setPermission(false);
      setGettingStream(false);
      console.log(error);
    }
  };
  useEffect(() => {
    let tracks:
      | {
          audio: MediaStreamTrack;
          video: MediaStreamTrack;
        }
      | undefined;
    startVideo({ audio: true, video: true }).then(res => {
      tracks = res;
    });

    return () => {
      console.log('calling Start page cleanup');
      console.log(tracks);
      tracks?.audio.stop();
      tracks?.video.stop();
    };
  }, []);

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
          <video ref={localVideoRef} playsInline muted className="rounded-lg w-full" />
        )}
      </div>
      <div className="sm:w-[40%] w-full  p-3  flex flex-col gap-3">
        <h2 className="text-center md:text-2xl sm:text-xl text-lg font-semibold">
          Join Room : {room.name}
        </h2>
        <div className="flex gap-3 items-center justify-center">
          <CustomButton
            onClick={() => {
              if (config.audio && localStream) {
                localStream.getAudioTracks().forEach(track => {
                  console.log('stopping audio track');
                  track.stop();
                  track.enabled = false;
                });
              } else if (!config.audio) {
                startVideo({
                  audio: true,
                  video: config.video
                });
              }
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
                if (localStream) {
                  localStream.getVideoTracks().forEach(track => {
                    track.stop();
                    track.enabled = false;
                  });
                }
              } else if (!config.video) {
                startVideo({
                  audio: config.audio,
                  video: true
                });
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
          disabled={!permission}
          onClick={async () => {
            setJoining(true);
            if (localStream) {
              clearStream(localStream);
            }
            await props.onJoin(config);
            setJoining(false);
          }}
          loading={joining}
          size={'lg'}
        >
          {permission ? 'Join Room' : 'Permission Denied'}
        </CustomButton>
      </div>
    </div>
  );
};
