import {
  getRoomNameList
} from '../controllers/socketController';

function initSocket(io) {
  const userSocketMap = new Map(); // userId와 socketId 매핑

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // 유저 로그인 (유저정보저장, 채팅방 자동 join)
    socket.on('login_user', async (userId) => {

      // 유저정보 저장
      userSocketMap.set(userId, socket);
      socket.data.userId = userId; // 소켓 데이터에 저장
      console.log(`User registered: ${userId}`);

      //채팅방 자동 join
      const roomNames = await getRoomNameList(userId);

      roomNames.forEach((roomName) => {
        const targetSocket = userSocketMap.get(userId);
        targetSocket.join(roomName);
        console.log(roomName);
      });
    });

    // 개인채팅방 입장
    // socket.on('enter_personal_room', (roomName, targetIds) => {
    //   if (!targetIds || targetIds.length === 0) {
    //     console.error('No target IDs provided');
    //     return; // targetIds가 없으면 처리를 멈춤
    //   }

    //   targetIds.forEach((id) => {
    //     console.log('id',id);
    //     const targetSocket = userSocketMap.get(id);
    //     console.log('targetSocket',targetSocket)
    //     if (!targetSocket) {
    //       console.error(`User ${id} is not connected`);
    //       return; // 연결된 소켓이 없다면 해당 유저는 방에 입장하지 않도록 처리
    //     }

    //     // 방에 해당 유저 추가
    //     targetSocket.join(roomName);
    //     console.log(`User ${id} joined room: ${roomName}`);
    //   });
      

    //   // socket.data.user_id = userData.userId;

    //   // io.to(roomTitle).emit('getTargetRoomInfo', roomData, msgData);
    // });

    //그룹 채팅방
    socket.on('enter_group_room', (userData) => {});

    //메시지 보내고 보여주기
    socket.on('send_msg', (user, roomName, message) => {
      const roomId = roomName.match(/\d+/)[0]; // roomName에서 roomId 추출
      io.to(roomName).emit('receive_msg', user, roomId, message);
      // setChatMessage(user, msg);
    });

    // 방 나가기
    socket.on('leave_room', (roomName) => {
      // socket.leave(roomName);
    });
    

    // 연결 해제
    socket.on('disconnect', () => {

    });
  });
}

export default initSocket;
