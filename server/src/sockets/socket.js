import { enterPersonalRoom } from '../controllers/socketController';

function initSocket(io) {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // 'enter_room' 이벤트 처리
    socket.on('enter_personal_room', (userData) => {
      // 클라이언트를 특정 방에 입장시킬 수 있음 (방 개념 추가 가능)
      enterPersonalRoom(userData);

      // 클라이언트에 응답
      socket.emit('room_entered', {
        success: true,
        room: 'sampleRoom', // 필요한 경우 방 이름 또는 기타 데이터
      });
    });

    // 연결 해제
    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });
}

export default initSocket;
