import db from '../../models';
import database from '../../config/mysql';
import { Op } from 'sequelize';

// 개인 채팅방 입장
// export async function enterPersonalRoom(userData) {
//   //참가자 아이디가 없을 경우 유저아이디와 친구들 아이디로 채팅 방을 찾음
//   const room = await db.Chat_participant.findOne({
//     where: {
//       user_id: userData.userId,
//       friend_id: userData.friendId,
//     },
//   });

//   if (!room) {
//     //채팅방이 없는 경우 채팅방과 참가자를 만듦
//     const newRoom = await db.Chatting_room.create({ type: 'personal' });

//     await db.Chat_participant.create({
//       room_id: newRoom.room_id,
//       user_id: userData.userId,
//       friend_id: userData.friendId,
//     });
//   }
// }

//채팅방 이름 리스트 조회
export async function getRoomNameList(userId) {
  // 친구 아이디와 유저아이디로 존재하는 채팅방 있는지 확인
  const [rooms] = await database.query(
    'SELECT chat_participant.room_id, chatting_room.room_name, chat_participant.friend_id, chatting_room.last_message, chatting_room.last_message_created_at FROM chat_participant LEFT JOIN chatting_room ON chat_participant.room_id = chatting_room.room_id WHERE chat_participant.user_id = ?',
    [userId]
  );

  const names = rooms.map((room) => {
    return `${room.room_name}_${room.room_id}`;
  });

  return names;
}

// 그룹채팅방 생성
export async function createGroupRoom(userData) {
  // 친구 아이디와 유저아이디로 존재하는 채팅방 있는지 확인
  const [room] = await database.query(
    'SELECT * FROM chat_participant as participant LEFT JOIN chatting_room as room ON participant.room_id = room.room_id WHERE participant.user_id = ? and participant.friend_id = ? and room.type = ?',
    [userData.userId, userData.friendId, 'group']
  );

  if (room.length == 0) {
    //채팅방이 없는 경우 채팅방과 참가자를 만듦
    const newRoom = await db.Chatting_room.create({ type: 'group' });

    const participants = userData.friendId.map((frId) => ({
      room_id: newRoom.room_id,
      user_id: userData.userId,
      friend_id: frId,
    }));

    await db.Chat_participant.bulkCreate(participants);
  }
}

export async function getRoomInfo(roomId) {
  const [room] = await database.query(
    'SELECT room.room_id, room.room_name, room.last_message, room.last_message_created_at, profile.profile_img_url FROM chat_participant as participant LEFT JOIN chatting_room as room ON participant.room_id = room.room_id LEFT JOIN profile ON participant.friend_id = profile.user_id WHERE participant.room_id = ?',
    [roomId]
  );

  const { profile_img_url, ...rest } = room[0];

  const data = { ...rest, images: [profile_img_url] };

  return data;
}

//채팅 메시지 저장
// export async function setChatMessage(msgData) {
//   const { userId, roomId, message } = msgData;

//  const newChat =  await db.Chatting.create({
//     user_id: userId,
//     room_id: roomId,
//     message: message,
//     del_yn: 'n',
//   });

//   // 메시지 추가
//   await db.Msg_read_user.create({
//     chat_id:newChat.chat_id,
//     user_id: userId,
//     room_id: roomId,
//   });
// }

//메시지 리스트 가져오기
// export async function getMessageList(roomId) {
//   const [room] = await database.query(
//     'SELECT * FROM chatting LEFT JOIN msg_read_user AS `read` ON chatting.room_id = `read`.room_id WHERE chatting.room_id = ?',
//     [roomId]
//   );
//   return room;
// }

// 채팅방 입장
export async function enterRoom() {}

//메시지 읽은 유저 업데이트
export async function updateReadUser(room_id, user_id) {
  const isExisting = await db.Msg_read_user.findAll({
    where: { room_id, user_id },
    attributes: ['read_yn'], // 필요한 필드만 가져옴
  });

  if (isExisting && isExisting.read_yn !== 'y') {
    await db.Msg_read_user.update(
      { read_yn: 'y' },
      { where: { room_id, user_id } }
    );
    console.log('읽은 유저 업데이트 완료!');
  } else {
    console.log('읽은 유저 이미 업데이트 되었음.');
  }
}
