'use client';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface ISocketMessage {
  userId: string;
  userName: string;
  payload: any;
  socketId?: string;
}

interface ISocketContext {
  socket: WebSocket | undefined;
  sendMsg: (msg: ISocketMessage) => void;
}

const SocketContext = createContext<ISocketContext>({
  socket: undefined,
  sendMsg: () => {},
});

interface ISocketProviderProps {
  children: ReactNode;
}

const SocketProvider = ({ children }: ISocketProviderProps) => {
  const [socket, setSocket] = useState<WebSocket | undefined>(undefined);

  const sendMsg = (msg: ISocketMessage) => {
    if (socket) {
      socket.send(JSON.stringify(msg));
    }
  };
  useEffect(() => {
    const socketConnection = new WebSocket('ws://localhost:8080');

    socketConnection.onopen = () => {
      console.log('WebSocket connection established');
      setSocket(socketConnection);
    };

    socketConnection.onerror = (error) => {
      console.error('WebSocket error', error);
    };

    socketConnection.onclose = () => {
      console.log('WebSocket connection closed');
      setSocket(undefined);
    };

    return () => {
      socketConnection.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, sendMsg }}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocket = (): ISocketContext => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }

  return context;
};

export { SocketProvider, useSocket };
