import { io } from 'socket.io-client';

let socket: any = null;

export const initSocket = () => {
  if (!socket) {
    socket = io('https://localhost:4000');
    socket.on('connect', () => {
      console.log('socket connect');
    });
    socket.on('disconnect', () => {
      console.log('socket disconnect');
    });
  }
  return null;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('소켓 연결 필요!');
  }
  return socket;
};
