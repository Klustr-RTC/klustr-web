import { createContext, PropsWithChildren, useContext, useEffect } from 'react';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

const SocketContext = createContext({});

const connection = new HubConnectionBuilder().withUrl(import.meta.env.VITE_SOCKET_URL).build();

export const SocketProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    if (connection.state == HubConnectionState.Disconnected) {
      connection
        .start()
        .catch(err => console.error(err))
        .then(() => {
          console.log('socket connected');
        });
    }
    return () => {
      if (connection && connection.state == HubConnectionState.Connected) {
        connection
          .stop()
          .catch(err => console.error(err))
          .then(() => {
            console.log('socket disconnected');
          });
      }
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        connection
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext) as {
    connection: HubConnection;
  };
};
