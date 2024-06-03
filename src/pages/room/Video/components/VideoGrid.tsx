import React, { useEffect, useRef, useState } from 'react';
import { User } from '@/types/auth';
import useKlustrStore from '@/hooks/store';
import { MicOff } from 'lucide-react';
import useWindowDimensions from '@/hooks/useDimensions';
import { VideoConfig } from '@/types/room';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type VideoProps = {
  stream?: MediaStream;
  user: User;
  isMuted?: boolean;
  rows: number;
  cols: number;
  config: { audio: boolean; video: boolean };
};

const CustomVideo: React.FC<VideoProps> = ({ stream, user, isMuted, rows, cols, config }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { height, width } = useWindowDimensions();
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
        height: `${(height - 230) / rows - 6}px`,
        width: Math.min(
          ((height - 230) / rows) * (4 / 3) - 24,
          (width - (width > 640 ? 80 : 0)) / cols - 24
        )
      }}
      className={`relative rounded-lg flex justify-center items-center h-full ${
        isMuted || !config.audio ? '' : 'border-2 border-violet-600'
      }`}
    >
      <video
        ref={videoRef}
        muted={isMuted || !config.audio}
        className={`${config.video ? '' : 'hidden'} rounded-lg h-full w-full object-cover`}
      />
      {!config.audio && (
        <div className="bg-black opacity-30 z-50 rounded-full p-1 absolute top-3 right-3 flex items-center space-x-2">
          <MicOff size={18} className="text-white" />
        </div>
      )}
      {!config.video && (
        <div className="rounded-lg h-full w-full   flex items-center justify-center dark:bg-neutral-900 bg-neutral-200">
          <Avatar className={`w-[120px] h-[120px]`}>
            <AvatarImage src={user?.avatar} className="object-cover overflow-visible" />
            <AvatarFallback>{user?.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      )}
      <p className="absolute bottom-2 left-2 font-semibold">{user.username}</p>
    </div>
  );
};

type Props = {
  peers: { [id: string]: { stream?: MediaStream; user: User; config: VideoConfig } };
  localStream: MediaStream;
  localConfig: { audio: boolean; video: boolean };
};

const VideoGrid = ({ peers, localStream, localConfig }: Props) => {
  const totalLength = Object.keys(peers).length + 1;
  const [gridConfig, setGridConfig] = useState({ rows: 1, cols: 1 });
  const userInfo = useKlustrStore(state => state.userInfo);

  useEffect(() => {
    const updateGridConfig = () => {
      const numVideos = totalLength;
      let cols = Math.ceil(Math.sqrt(numVideos));
      let rows = Math.ceil(numVideos / cols);
      let width = window.innerWidth;
      let height = window.innerHeight;
      if (width > 640) {
        height = height - 230;
      } else {
        height = height - 210;
      }
      if (width > 640) {
        width = width - 80;
      }

      const aspectRatio = width / height;

      while (cols / rows > aspectRatio) {
        cols--;
        rows = Math.ceil(numVideos / cols);
      }

      setGridConfig({ rows, cols });
    };

    updateGridConfig();
    window.addEventListener('resize', updateGridConfig);

    return () => window.removeEventListener('resize', updateGridConfig);
  }, [totalLength]);

  const { rows, cols } = gridConfig;

  return (
    <div
      className="grid h-full w-full gap-3 p-2 justify-items-center "
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`
      }}
    >
      <CustomVideo
        config={{
          audio: localConfig.audio,
          video: localConfig.video
        }}
        cols={cols}
        rows={rows}
        stream={localStream}
        user={userInfo!}
        isMuted
      />
      {Object.values(peers).map(user => {
        return (
          <CustomVideo
            config={user.config}
            cols={cols}
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
