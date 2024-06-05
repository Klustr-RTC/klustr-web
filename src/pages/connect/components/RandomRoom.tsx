import { useEffect, useRef, useState } from "react"
import Video from "./Video"
import { VideoConfig } from "@/types/room";
import useKlustrStore from "@/hooks/store";
import { Mic, MicOff, VideoOff, Video as V, MessageSquareText } from "lucide-react";
import Chat from "./Chat";
import ChatSheet from "./ChatSheet";
import { RandomMessage } from "@/types/message";

function RandomRoom() {
  const userInfo = useKlustrStore(state => state.userInfo)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const [gettingStream, setGettingStream] = useState(false);
  const [permission, setPermission] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [messages, setMessages] = useState<RandomMessage[]>([]);
  const [config, setConfig] = useState({
    audio: false,
    video: false
  });
  const [chatOpen, setChatOpen] = useState(false);

  const clearStream = (stream: MediaStream) => {
    console.log('Clearing Stream');
    stream.getTracks().forEach(track => track.stop());
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
      }
      localStreamRef.current = stream;
      setLocalStream(prev => {
        if (prev) {
          clearStream(prev);
        }
        return stream;
      });
      setGettingStream(false);
    } catch (error) {
      setPermission(false);
      setGettingStream(false);
      console.log(error);
    }
  };

  const toggleAudio = () => {

  }
  const toggleVideo = () => {

  }

  useEffect(() => {
    startVideo(config);
  }, [])
  return (
    <div className="flex h-[calc(100vh-60px)]">
      <div className="lg:w-[500px] max-lg:w-full flex flex-col gap-1">
        <div className="flex-1">
          <Video
            config={config}
            user={userInfo!}
            isMuted
            stream={localStream!}
          />
        </div>
        <div className="flex-1 relative">
          <Video
            config={config}
            user={userInfo!}
            isMuted
            stream={localStream!}
          />
          <div className="flex absolute bottom-2 right-4 items-center justify-center gap-4">
            <div
              onClick={() => toggleAudio()}
              className={`cursor-pointer p-2 rounded-full ${!config.audio ? 'bg-primary text-white' : 'bg-muted'
                }`}
            >
              {config.audio ? <Mic size={22} /> : <MicOff size={22} />}
            </div>
            <div
              onClick={() => toggleVideo()}
              className={`cursor-pointer p-2 rounded-full ${!config.video ? 'bg-primary text-white' : 'bg-muted'
                }`}
            >
              {config.video ? <V size={22} /> : <VideoOff size={22} />}
            </div>
            <div
              onClick={() => {
                setChatOpen(!chatOpen);
              }}
              className={`${chatOpen && 'text-primary'
                } relative md:hidden cursor-pointer p-3 bg-muted rounded-full`}
            >
              <MessageSquareText />
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex max-lg:hidden px-4">
        <Chat messages={messages} />
      </div>
      <ChatSheet
        messages={messages}
        open={chatOpen}
        setOpen={setChatOpen}
      />
    </div>
  )
}

export default RandomRoom
