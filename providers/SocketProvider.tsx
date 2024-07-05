'use client';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface ISocketContext {
  socket: WebSocket | undefined;
}

const SocketContext = createContext<ISocketContext>({
  socket: undefined,
});

interface ISocketProviderProps {
  children: ReactNode;
}

const SocketProvider = ({ children }: ISocketProviderProps) => {
  const [socket, setSocket] = useState<WebSocket | undefined>(undefined);

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

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

const useSocket = (): WebSocket | undefined => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }

  return context.socket;
};

export { SocketProvider, useSocket };
