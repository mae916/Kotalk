import { io } from 'socket.io-client';

let socket: any = null;

export const initSocket = () => {
  if (!socket) {
    socket = io('https://localhost:4000');
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket is not initialized. Call initSocket() first.');
  }
  return socket;
};
