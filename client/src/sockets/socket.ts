import { io } from 'socket.io-client';

let socket: any = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(process.env.REACT_APP_SERVER_URL, {
          path:'/api/socket.io',
          transports: ["websocket"],
        });
    socket.on('connect', () => {
      console.log('socket connect');
    });
    socket.on('disconnect', () => {
      console.log('socket disconnect');
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('소켓 연결 필요!');
  }
  return socket;
};
