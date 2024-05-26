import React, { useEffect, useRef } from 'react';
import { User } from '@/types/auth';
import useKlustrStore from '@/hooks/store';
import { MicOff } from 'lucide-react';
import useWindowDimensions from '@/hooks/useDimensions';
import { VideoConfig } from '@/types/room';

type VideoProps = {
  stream?: MediaStream;
  user: User;
  isMuted?: boolean;
  rows: number;
  config: { audio: boolean; video: boolean };
};

const CustomVideo: React.FC<VideoProps> = ({ stream, user, isMuted, rows, config }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { height } = useWindowDimensions();
  useEffect(() => {
    const play = async () => {
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    };
    play();
  }, [stream]);

  return (
    <div
      style={{
        height: `${(height - 216) / rows}px`,
        width: '100%'
      }}
      className={`relative rounded-lg flex justify-center items-center h-full w-full ${
        isMuted || !config.audio ? '' : 'border-2 border-violet-600'
      }`}
    >
      <video
        ref={videoRef}
        muted={isMuted || !config.audio}
        style={{
          height: `${(height - 216) / rows}px`,
          width: '100%'
        }}
        className={`${config.video ? '' : 'hidden'} rounded-lg w-full h-full `}
      />
      {!config.audio && (
        <div className="bg-black opacity-30 z-50 rounded-full p-1 absolute top-3 right-3 flex items-center space-x-2">
          <MicOff size={18} className="text-white" />
        </div>
      )}
      {!config.video && (
        <div
          style={{ height: (height - 216) / rows, width: '100%' }}
          className="rounded-lg   flex items-center justify-center dark:bg-neutral-900 bg-neutral-200"
        >
          <p className="font-bold">{user.username}</p>
        </div>
      )}
    </div>
  );
};

type Props = {
  peers: { [id: string]: { stream?: MediaStream; user: User; config: VideoConfig } };
  localStream: MediaStream;
  localConfig: { audio: boolean; video: boolean };
};

const VideoGrid = ({ peers, localStream, localConfig }: Props) => {
  const totalVideos = Object.keys(peers).length + 1;
  const columns = Math.ceil(Math.sqrt(totalVideos));
  const rows = Math.ceil(totalVideos / columns);
  const userInfo = useKlustrStore(state => state.userInfo);

  return (
    <div
      className="grid h-full gap-3 p-2"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`
      }}
    >
      <CustomVideo
        config={{
          audio: localConfig.audio,
          video: localConfig.video
        }}
        rows={rows}
        stream={localStream}
        user={userInfo!}
        isMuted
      />
      {Object.values(peers).map(user => {
        return (
          <CustomVideo
            config={user.config}
            rows={rows}
            key={user.user.id}
            stream={user.stream}
            user={user.user}
          />
        );
      })}
    </div>
  );
};

export default VideoGrid;
