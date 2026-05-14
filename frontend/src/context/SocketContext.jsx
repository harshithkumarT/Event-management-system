import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { accessToken, user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!accessToken || !user) {
      setSocket(null);
      return undefined;
    }

    const nextSocket = io(import.meta.env.VITE_SOCKET_URL || 'https://event-management-system-backend-01.onrender.com', {
      auth: { token: accessToken },
      transports: ['websocket'],
    });

    nextSocket.on('connect', () => setConnected(true));
    nextSocket.on('disconnect', () => setConnected(false));
    setSocket(nextSocket);

    return () => {
      nextSocket.disconnect();
    };
  }, [accessToken, user]);

  const value = useMemo(() => ({ socket, connected }), [socket, connected]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }

  return context;
};