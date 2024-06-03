import { RoomInfo } from '@/components/RoomInfo';
import { MemberWithUser } from '@/types/member';
import { Room, VideoConfig } from '@/types/room';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { StartPage } from './StartPage';
import { Info, LogOut, MessageSquareText, Mic, MicOff, Users, Video, VideoOff } from 'lucide-react';
import MediaChat from './MediaChat';
import useKlustrStore from '@/hooks/store';
import { useSocket } from '@/hooks/useSocket';
// import { HubConnectionState } from '@microsoft/signalr';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { webRoutes } from '@/constants/routes';
import { User } from '@/types/auth';
import { Message } from '@/types/message';
import Peer, { MediaConnection } from 'peerjs';
import VideoGrid from './VideoGrid';
import RoomUsers from './RoomUsers';
import { Loader } from '@/components/Loader';

type Props = {
  room: Room;
  setRoom: Dispatch<SetStateAction<Room | undefined>>;
  members: MemberWithUser[];
  setMembers: (members: MemberWithUser[]) => void;
};

const audio = new Audio('/beep.mp3');

export const MediaRoom = ({ room, setRoom, members, setMembers }: Props) => {
  const userInfo = useKlustrStore(state => state.userInfo);
  const [infoOpen, setInfoOpen] = useState(false);
  const [roomUserOpen, setRoomUserOpen] = useState(false);
  const [roomJoining, setRoomJoining] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [showStartPage, setShowStartPage] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [config, setConfig] = useState<VideoConfig>({
    audio: true,
    video: true
  });
  const navigate = useNavigate();
  const { connection } = useSocket();
  const [roomUsers, setRoomUsers] = useState([] as User[]);
  const [messages, setMessages] = useState([] as Message[]);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [peers, setPeers] = useState<{
    [id: string]: { stream: MediaStream; user: User; config: VideoConfig };
  }>({});
  const [activeCalls, setActiveCalls] = useState<{ [id: string]: MediaConnection }>({});

  const handleUserJoined = useCallback(
    async (user: { user: User; room: string }) => {
      if (userInfo?.id != user.user.id) {
        audio.volume = 0.5;
        audio.play();
        toast.success(`${user?.user?.username} joined the room`);
      }
      setRoomUsers(prev => {
        if (prev.find(u => u.id === user?.user?.id)) return prev;
        return [...prev, user.user];
      });
    },
    [userInfo?.id]
  );

  const handleSendConnectedUsers = useCallback((users: User[]) => {
    console.log(users);
    setRoomUsers(users);
  }, []);
  const handleReceiveMessage = useCallback((message: Message) => {
    console.log(message);
    if (message.user.id !== userInfo?.id) {
      toast.success(`${message.user.username} sent: ${message.content}`);
    }
    setMessages(prev => [...prev, message]);
  }, []);

  const handleUserLeft = useCallback((user: { user: User; room: string }, id: string) => {
    toast.success(`${user?.user?.username} left the room`);
    setRoomUsers(prev => prev.filter(u => u.id !== user.user.id));
    console.log('User Left', id);
    setPeers(prevPeers => {
      const updatedPeers = { ...prevPeers };
      const id = Object.keys(updatedPeers).find(id => updatedPeers[id].user.id === user.user.id);
      if (id) {
        delete updatedPeers[id];
        delete activeCalls[id];
      }
      return updatedPeers;
    });
  }, []);
  const handleRoomJoinResponse = useCallback(
    (res: number, count: number) => {
      console.log('No of Users', count);
      if (res === 1) {
        setRoomJoining(false);
        audio.volume = 0.5;
        audio.play();
        console.log('Joined Room');
      } else if (res == 2) {
        toast.error('Room Full');
        navigate(webRoutes.home);
      } else {
        toast.error('Error Joining Room');
        navigate(webRoutes.home);
      }
    },
    [navigate]
  );

  const handleToggleVideo = useCallback((peerId: string, isVideoOn: boolean) => {
    // console.log('Toggle Video', peerId, isVideoOn);
    setPeers(prevPeers => {
      const updatedPeers = { ...prevPeers };
      const peer = updatedPeers[peerId];
      if (peer) {
        peer.stream.getVideoTracks().forEach(track => {
          track.enabled = isVideoOn;
        });
        updatedPeers[peerId] = { ...peer, config: { ...peer.config, video: isVideoOn } };
      }
      return updatedPeers;
    });
  }, []);

  const handleToggleAudio = useCallback((peerId: string, isAudioOn: boolean) => {
    // console.log('Toggle Audio', peerId, isAudioOn);

    setPeers(prevPeers => {
      const updatedPeers = { ...prevPeers };
      const peer = updatedPeers[peerId];
      if (peer) {
        peer.stream.getAudioTracks().forEach(track => {
          track.enabled = isAudioOn;
        });
        updatedPeers[peerId] = { ...peer, config: { ...peer.config, audio: isAudioOn } };
      }
      return updatedPeers;
    });
  }, []);

  useEffect(() => {
    return () => {
      console.log('Unmounting Media Room');
      localStream?.getTracks().forEach(track => {
        console.log('Stopping Track');
        track.stop();
      });
      if (peer) {
        peer.destroy();
      }
    };
  }, []);

  useEffect(() => {
    connection.on('ReceiveMessage', handleReceiveMessage);
    connection.on('SendConnectedUsers', handleSendConnectedUsers);
    connection.on('UserJoined', handleUserJoined);
    connection.on('UserLeft', handleUserLeft);
    connection.on('JoinRoomResponse', handleRoomJoinResponse);
    connection.on('ToggleVideo', handleToggleVideo);
    connection.on('ToggleAudio', handleToggleAudio);
    connection?.on('NewPeer', async (newPeerId: string, user: User, peerConfig: VideoConfig) => {
      if (newPeerId !== peer?.id) {
        console.log('New Peer From', user.username);
        console.log('Calling ', user?.username);

        const call = peer?.call(newPeerId, localStream!, {
          metadata: { user: userInfo, config: config }
        });
        if (call) {
          activeCalls[newPeerId] = call;
          setActiveCalls(activeCalls);
        }
        call?.on('stream', remoteStream => {
          console.log('Stream Received from ', user?.username);
          setPeers(prevPeers => ({
            ...prevPeers,
            [newPeerId]: { stream: remoteStream, user: user, config: peerConfig }
          }));
        });
        call?.on('close', () => {
          console.log('Call Closed');
          delete activeCalls[newPeerId];
          setActiveCalls(activeCalls);
          setPeers(prevPeers => {
            const updatedPeers = { ...prevPeers };
            delete updatedPeers[newPeerId];
            return updatedPeers;
          });
        });
      }
    });
    return () => {
      connection.off('ReceiveMessage');
      connection.off('SendConnectedUsers');
      connection.off('UserJoined');
      connection.off('UserLeft');
      connection.off('JoinRoomResponse');
      connection.off('NewPeer');
      connection.off('ToggleAudio');
      connection.off('ToggleVideo');
    };
  }, [
    connection,
    handleReceiveMessage,
    handleSendConnectedUsers,
    handleUserJoined,
    handleUserLeft,
    handleRoomJoinResponse,
    peer,
    localStream,
    userInfo,
    config,
    handleToggleVideo,
    handleToggleAudio,
    activeCalls
  ]);

  const init = async (config: VideoConfig) => {
    // Get local media stream
    try {
      console.log('Init Called');
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
      setLocalStream(stream);
      const peer = new (await import('peerjs')).default();
      setPeer(peer);
      peer.on('open', id => {
        console.log('Peer Opened', id);
        console.log('Joining Room');
        connection?.invoke('JoinVideoRoom', { Room: room.id, User: userInfo }, id, config);
      });
      peer.on('call', call => {
        console.log('Call Received from ', call.metadata.user?.username);
        call.answer(stream);
        activeCalls[call.peer] = call;
        setActiveCalls(activeCalls);
        call.on('stream', remoteStream => {
          console.log('Stream Received from ', call.metadata.user?.username);
          setPeers(prevPeers => ({
            ...prevPeers,
            [call.peer]: {
              stream: remoteStream,
              user: call.metadata.user,
              config: call.metadata.config
            }
          }));
        });
        call.on('close', () => {
          delete activeCalls[call.peer]; // Remove the call when it ends
          setActiveCalls(activeCalls);
        });
      });
    } catch (error) {
      console.log(error);
      setRoomJoining(false);
      toast.error('Error Joining Room');
      navigate(webRoutes.home);
    }
  };
  useEffect(() => {
    return () => {
      if (localStream) {
        clearStream(localStream);
      }
    };
  }, []);

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

  const changeStreamForAllPeers = async (stream: MediaStream) => {
    const videoTrack = stream.getVideoTracks()[0];
    const audioTrack = stream.getAudioTracks()[0];
    Object.values(activeCalls).forEach(call => {
      const senders = call.peerConnection.getSenders();
      senders.forEach(sender => {
        if (sender.track?.kind === 'video' && videoTrack) {
          sender.replaceTrack(videoTrack);
        }
        if (sender.track?.kind === 'audio' && audioTrack) {
          sender.replaceTrack(audioTrack);
        }
      });
    });
  };

  const toggleVideo = () => {
    try {
      // console.log('Toggling Video', peer?.id, !config.video);
      connection.invoke('ToggleVideo', peer?.id, !config.video);
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
            if (localStream) {
              clearStream(localStream);
            }
            changeStreamForAllPeers(stream);
            setLocalStream(stream);
          });
      }
      setConfig({ ...config, video: !config.video });
    } catch (error) {
      console.log(error);
    }
  };
  const toggleAudio = () => {
    try {
      // console.log('Toggling Audio', peer?.id, !config.audio);
      connection.invoke('ToggleAudio', peer?.id, !config.audio);
      if (config.audio) {
        console.log('Audio Off');
        localStream?.getAudioTracks().forEach(track => {
          track.stop();
          track.enabled = false;
        });
      } else {
        console.log('Audio On');
        navigator.mediaDevices
          .getUserMedia({
            video: config.video
              ? {
                facingMode: 'user', // Front or user-facing camera
                aspectRatio: 4 / 3
              }
              : false,
            audio: true
          })
          .then(stream => {
            if (localStream) {
              clearStream(localStream);
            }
            changeStreamForAllPeers(stream);
            setLocalStream(stream);
          });
      }
      setConfig({ ...config, audio: !config.audio });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Loader loading={roomJoining} />
      <div className={`w-full ${roomJoining ? 'hidden' : 'flex'} flex-col m-auto flex-1`}>
        <div className="h-full">
          <div className="w-full">
            {/* Title Header  */}
            <div
              onClick={() => setInfoOpen(true)}
              className="z-2 cursor-pointer flex justify-center items-center py-2 bg-muted sticky top-0 backdrop-blur-lg border-b-[1px]"
            >
              <h1 className="text-2xl font-semibold text-center">{room.name}</h1>
            </div>
            {showStartPage ? (
              <StartPage
                onJoin={async config => {
                  setShowStartPage(false);
                  setConfig(config);
                  setRoomJoining(true);
                  init(config);
                }}
                room={room}
              />
            ) : (
              <>
                <VideoGrid localConfig={config} peers={peers} localStream={localStream!} />
                {/* <VideoGrid peers={{}} localStream={localStream!} /> */}
              </>
            )}
          </div>
        </div>
        {/* Media Controls */}
        {!showStartPage && (
          <div className="flex items-center justify-center py-4 sm:gap-10 gap-4">
            <div
              onClick={() => toggleAudio()}
              className={`cursor-pointer p-3 rounded-full ${!config.audio ? 'bg-primary text-white' : 'bg-muted'
                }`}
            >
              {config.audio ? <Mic /> : <MicOff />}
            </div>
            <div
              onClick={() => toggleVideo()}
              className={`cursor-pointer p-3 rounded-full ${!config.video ? 'bg-primary text-white' : 'bg-muted'
                }`}
            >
              {config.video ? <Video /> : <VideoOff />}
            </div>
            <div
              onClick={() => setRoomUserOpen(true)}
              className="relative cursor-pointer p-3 bg-muted rounded-full"
            >
              <Users />
              <span className="bg-secondary rounded-full text-sm px-1 absolute top-0 right-0">
                {roomUsers.length}
              </span>
            </div>
            <div
              onClick={() => setChatOpen(!chatOpen)}
              className={`${chatOpen && 'text-primary'
                } relative cursor-pointer p-3 bg-muted rounded-full`}
            >
              <MessageSquareText />
              <span className="w-2 h-2 border-white border-[1px] bg-red-500 rounded-full absolute top-3 right-3"></span>
            </div>
            <div
              className={`${infoOpen && 'text-primary'} cursor-pointer p-3 bg-muted rounded-full`}
              onClick={() => setInfoOpen(!infoOpen)}
            >
              <Info />
            </div>
            <div
              className={`bg-red-600 p-3 rounded-full cursor-pointer hover:bg-red-700`}
              onClick={() => navigate('/')}
            >
              <LogOut />
            </div>
          </div>
        )}
      </div>
      <RoomInfo
        setMembers={setMembers}
        room={room}
        setRoom={setRoom}
        members={members}
        open={infoOpen}
        onOpenChange={setInfoOpen}
      />
      <MediaChat open={chatOpen} messages={messages} room={room} setOpen={setChatOpen} />
      <RoomUsers open={roomUserOpen} setOpen={setRoomUserOpen} users={roomUsers} />
    </>
  );
};
