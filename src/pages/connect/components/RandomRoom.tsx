import { useCallback, useEffect, useRef, useState } from 'react';
import Video from './Video';
import { VideoConfig } from '@/types/room';
import useKlustrStore from '@/hooks/store';
import { Mic, MicOff, VideoOff, Video as V, MessageSquareText, SkipForward } from 'lucide-react';
import Chat from './Chat';
import ChatSheet from './ChatSheet';
import { RandomMessage } from '@/types/message';
import { useSocket } from '@/hooks/useSocket';
import Peer, { MediaConnection } from 'peerjs';
import { User } from '@/types/auth';
import { toast } from 'sonner';
import { webRoutes } from '@/constants/routes';
import { useNavigate } from 'react-router-dom';
import { HubConnectionState } from '@microsoft/signalr';
import Start from './Start';

function RandomRoom() {
  const userInfo = useKlustrStore(state => state.userInfo);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [messages, setMessages] = useState<RandomMessage[]>([]);
  const [config, setConfig] = useState({
    audio: true,
    video: true
  });
  const [joined, setJoined] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const { connection } = useSocket();
  const [peer, setPeer] = useState<Peer | null>(null);
  const [remoteUser, setRemoteUser] = useState<{
    stream: MediaStream;
    user: User;
    config: VideoConfig;
  } | null>(null);
  const [roomJoining, setRoomJoining] = useState(false);
  const [remoteCall, setRemoteCall] = useState<MediaConnection | null>(null);
  const [liveCount, setLiveCount] = useState(0);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const navigate = useNavigate();

  const clearStream = (stream: MediaStream) => {
    console.log('Clearing Stream');
    stream.getTracks().forEach(track => track.stop());
  };

  const toggleVideo = () => {
    try {
      connection.invoke('ToggleRandomVideo', peer?.id, !config.video);
      if (config.video) {
        console.log('Video Off');
        localStream?.getVideoTracks().forEach(track => {
          track.stop();
          track.enabled = false;
        });
      } else {
        console.log('Video On');
        navigator.mediaDevices
          .getUserMedia({
            video: {
              facingMode: 'user', // Front or user-facing camera
              aspectRatio: 4 / 3
            },
            audio: config.audio
          })
          .then(stream => {
            if (!stream) return;
            localStreamRef.current = stream;
            changeStreamForPeer(stream);
            setLocalStream(prev => {
              if (prev) {
                clearStream(prev);
              }
              return stream;
            });
          });
      }
      setConfig({ ...config, video: !config.video });
    } catch (error) {
      console.log(error);
    }
  };
  const toggleAudio = () => {
    try {
      connection.invoke('ToggleRandomAudio', peer?.id, !config.audio);
      if (config.audio) {
        console.log('Audio Off');
        localStream?.getAudioTracks().forEach(track => {
          track.stop();
        });
      } else {
        console.log('Audio On');
        navigator.mediaDevices
          .getUserMedia({
            video: config.video
              ? {
                  facingMode: 'user',
                  aspectRatio: 4 / 3
                }
              : false,
            audio: true
          })
          .then(stream => {
            if (!stream) return;
            localStreamRef.current = stream;
            changeStreamForPeer(stream);
            setLocalStream(prev => {
              if (prev) {
                clearStream(prev);
              }
              return stream;
            });
          });
      }
      setConfig({ ...config, audio: !config.audio });
    } catch (error) {
      console.log(error);
    }
  };
  const changeStreamForPeer = async (stream: MediaStream) => {
    if (!remoteCall) return;
    const videoTrack = stream.getVideoTracks()[0];
    const audioTrack = stream.getAudioTracks()[0];
    const senders = remoteCall.peerConnection.getSenders();
    senders.forEach(sender => {
      if (sender.track?.kind === 'video' && videoTrack) {
        sender.replaceTrack(videoTrack);
      }
      if (sender.track?.kind === 'audio' && audioTrack) {
        sender.replaceTrack(audioTrack);
      }
    });
  };
  const handleReceiveRandomMessage = useCallback(
    (message: RandomMessage) => {
      if (message.user.id === userInfo?.id) return;
      toast(`${message.user.username}: ${message.content}`);
      setMessages(prev => [...prev, message]);
    },
    [userInfo?.id]
  );
  const handleSkipUser = useCallback(() => {
    connection.invoke('SkipUser', config, peer?.id);
    remoteCall?.close();
    setRemoteCall(null);
    setRemoteUser(null);
    setMessages([]);
  }, [config, connection, peer?.id, remoteCall]);

  const handleRandomUserJoined = useCallback(
    (user: User, peerConfig: VideoConfig, peerId: string) => {
      console.log('New Peer From', user.username);
      const call = peer?.call(peerId, localStream!, {
        metadata: { user: userInfo, config: config }
      });
      if (call) {
        setRemoteCall(call);
        call.on('stream', stream => {
          console.log('Stream Received from ', user?.username, peerConfig);
          setRemoteUser({ stream: stream, user: user, config: peerConfig });
        });
        call?.on('close', () => {
          console.log('Call Closed');
          setRemoteCall(null);
          setRemoteUser(null);
          setMessages([]);
        });
      }
    },
    [config, localStream, peer, userInfo]
  );
  const handleToggleVideo = useCallback(
    (_peer: string, isVideoOn: boolean) => {
      if (remoteUser) {
        remoteUser.stream.getVideoTracks().forEach(track => {
          track.enabled = isVideoOn;
        });
        setRemoteUser({ ...remoteUser, config: { ...remoteUser.config, video: isVideoOn } });
      }
    },
    [remoteUser]
  );
  const handleToggleAudio = useCallback(
    (_peer: string, isAudioOn: boolean) => {
      if (remoteUser) {
        remoteUser.stream.getAudioTracks().forEach(track => {
          track.enabled = isAudioOn;
        });
        setRemoteUser({ ...remoteUser, config: { ...remoteUser.config, audio: isAudioOn } });
      }
    },
    [remoteUser]
  );
  const handleRoomJoinResponse = useCallback(
    (res: number) => {
      if (res === 1) {
        setRoomJoining(false);
        setJoined(true);
        console.log('Joined Room');
      } else {
        toast.error('Error Joining Room');
        navigate(webRoutes.home);
      }
    },
    [navigate]
  );
  useEffect(() => {
    connection.on('RandomUserJoined', handleRandomUserJoined);
    connection.on('SkipUser', handleSkipUser);
    connection.on('ReceiveRandomMessage', handleReceiveRandomMessage);
    connection.on('ToggleVideo', handleToggleVideo);
    connection.on('ToggleAudio', handleToggleAudio);
    connection.on('JoinRoomResponse', handleRoomJoinResponse);
    connection.on('OnCount', (count: number) => {
      setLiveCount(count);
    });
    return () => {
      connection.off('OnCount');
      connection.off('RandomUserJoined', handleRandomUserJoined);
      connection.off('SkipUser', handleSkipUser);
      connection.off('ReceiveRandomMessage', handleReceiveRandomMessage);
      connection.off('ToggleVideo', handleToggleVideo);
      connection.off('ToggleAudio', handleToggleAudio);
      connection.off('JoinRoomResponse', handleRoomJoinResponse);
    };
  }, [
    connection,
    handleRandomUserJoined,
    handleReceiveRandomMessage,
    handleRoomJoinResponse,
    handleSkipUser,
    handleToggleAudio,
    handleToggleVideo
  ]);

  useEffect(() => {
    return () => {
      remoteCall?.close();
      if (peer) peer.destroy();
      if (localStreamRef.current) {
        clearStream(localStreamRef.current);
      }
      setLocalStream(null);
    };
  }, []);
  const Init = async () => {
    if (roomJoining) {
      return;
    }
    if (joined) return;
    setRoomJoining(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user', // Front or user-facing camera
          aspectRatio: 4 / 3
        },
        audio: true
      });
      console.log(config);
      if (!config.audio) {
        console.log('Audio Off');
        stream.getAudioTracks().forEach(track => {
          track.stop();
          track.enabled = false;
        });
      }
      if (!config.video) {
        console.log('Video Off');
        stream.getVideoTracks().forEach(track => {
          track.stop();
          track.enabled = false;
        });
      }
      console.log(stream);
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
      const p = new (await import('peerjs')).default();
      setPeer(p);
      p.on('open', id => {
        console.log('Peer Opened', id);
        console.log('Joining Room');
        if (connection.state !== HubConnectionState.Connected) return;
        connection?.invoke('JoinRandomRoom', userInfo, config, id);
      });
      p.on('call', call => {
        console.log('Call Received from ', call.metadata.user?.username);
        call.answer(stream);
        setRemoteCall(call);
        call.on('stream', remoteStream => {
          console.log('Stream Received from ', call.metadata.user?.username);
          setRemoteUser({
            stream: remoteStream,
            user: call.metadata.user,
            config: call.metadata.config
          });
        });
        call.on('close', () => {
          setRemoteCall(null);
          setRemoteUser(null);
          setMessages([]);
        });
      });
    } catch (error) {
      console.log(error);
      setRoomJoining(false);
      toast.error('Error Joining Room');
      navigate(webRoutes.home);
    }
  };

  const skipUser = async () => {
    if (!remoteCall || !remoteUser) return;
    connection.invoke('SkipUser', config, peer?.id);
    remoteCall?.close();
    setRemoteCall(null);
    setRemoteUser(null);
    setMessages([]);
  };

  const sendMessage = (content: string) => {
    connection?.invoke('SendRandomMessage', {
      content,
      user: userInfo,
      timeStamp: new Date().toISOString()
    });
    setMessages(prev => [
      ...prev,
      { content, user: userInfo!, timeStamp: new Date().toISOString() }
    ]);
  };
  return isStarted ? (
    <div className="flex h-[calc(100dvh-60px)]">
      <div className="lg:w-[500px] max-lg:w-full flex flex-col gap-1">
        <div className="h-1/2 relative">
          <div className="absolute z-40 top-2 left-4">
            <h1 className="text-xl font-bold text-center dark:text-white text-neutral-900">
              {liveCount} Live
            </h1>
          </div>
          {remoteUser ? (
            <Video config={remoteUser.config} user={remoteUser.user} stream={remoteUser.stream} />
          ) : (
            <div className="h-full w-full  flex items-center justify-center dark:bg-neutral-900 bg-neutral-200">
              Connecting...
            </div>
          )}
        </div>
        <div className="h-1/2 relative">
          <Video config={config} user={userInfo!} isMuted stream={localStream ?? undefined} />
          <div className="flex absolute bottom-2 right-4 items-center justify-center gap-4">
            <div
              onClick={() => toggleAudio()}
              className={`cursor-pointer p-2 rounded-full ${
                !config.audio ? 'bg-primary text-white' : 'bg-muted'
              }`}
            >
              {config.audio ? <Mic size={22} /> : <MicOff size={22} />}
            </div>
            <div
              onClick={() => toggleVideo()}
              className={`cursor-pointer p-2 rounded-full ${
                !config.video ? 'bg-primary text-white' : 'bg-muted'
              }`}
            >
              {config.video ? <V size={22} /> : <VideoOff size={22} />}
            </div>
            <div
              onClick={() => skipUser()}
              className={`cursor-pointer p-2 ${
                !remoteCall || !remoteUser ? 'opacity-50' : ''
              } rounded-full bg-primary text-white`}
            >
              <SkipForward size={22} />
            </div>
            <div
              onClick={() => {
                setChatOpen(!chatOpen);
              }}
              className={`${
                chatOpen && 'text-primary'
              } relative lg:hidden cursor-pointer p-3 bg-muted rounded-full`}
            >
              <MessageSquareText />
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex max-lg:hidden px-4">
        <Chat sendMessage={sendMessage} messages={messages} />
      </div>
      <ChatSheet Send={sendMessage} messages={messages} open={chatOpen} setOpen={setChatOpen} />
    </div>
  ) : (
    <Start
      liveCount={liveCount}
      setStarted={start => {
        setIsStarted(start);
        Init();
      }}
    />
  );
}

export default RandomRoom;
