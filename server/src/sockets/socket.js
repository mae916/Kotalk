import {
  getRoomNameList,
  updateReadUser,
} from '../controllers/socketController';

// 특정 유저가 특정 방에 있는지 확인하는 함수
function isUserInRoom(io, socketId, roomName) {
  const room = io.sockets.adapter.rooms.get(roomName);
  if (!room) {
    console.log('방 자체가 존재하지 않음');
    return false; // 방 자체가 존재하지 않음
  }
  return room.has(socketId); // 소켓 ID가 방에 존재하는지 확인
}

function initSocket(io) {
  const userSocketMap = new Map(); // userId와 socketId 매핑

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // 유저 로그인 (유저정보저장, 채팅방 자동 join)
    socket.on('login_user', async (userId) => {
      userSocketMap.set(userId, socket);
      socket.data.userId = userId;
      console.log(`User registered: ${userId}`);

      const roomNames = await getRoomNameList(userId);

      roomNames.forEach((roomName) => {
        const targetSocket = userSocketMap.get(userId);
        if (!isUserInRoom(io, targetSocket.id, roomName)) {
          targetSocket.join(roomName);
          console.log(`User ${userId} joined room: ${roomName}`);
        }
      });
    });

    // 메시지 보내기
    socket.on('send_msg', (user, roomName, message) => {
      console.log('send_msg');
      const targetSocket = userSocketMap.get(user.user_id);

      // 해당 room에 참여 여부 확인
      if (!isUserInRoom(io, targetSocket.id, roomName)) {
        console.log(
          `User ${user.user_id} is not in room ${roomName}, joining room`
        );
        targetSocket.join(roomName); // 방에 참가
      }

      io.to(roomName).emit('receive_msg', user, message); // 메시지 전송
      console.log(`Message sent to room ${roomName}: ${message}`);

      const room = io.sockets.adapter.rooms.get(roomName);
      console.log('roomroom', room);
    });

    // 메시지 읽음 처리
    socket.on('read_message', (room_id, roomName, user_id) => {
      updateReadUser(room_id, user_id);
      io.to(roomName).emit('read_count_apply', user_id);
    });

    // 메시지 삭제 처리
    socket.on('del_message', (roomName, chat_id) => {
      io.to(roomName).emit('del_message_apply', chat_id);
    });

    // 방 나가기
    socket.on('leave_room', (roomName) => {
      socket.leave(roomName);
    });

    // 연결 해제
    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });
}

export default initSocket;
