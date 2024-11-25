import db from '../models';
import database from '../config/mysql';
import { Op } from 'sequelize';

// 개인 채팅방 입장
export async function enterPersonalRoom(userData) {
  //참가자 아이디가 없을 경우 유저아이디와 친구들 아이디로 채팅 방을 찾음
  const room = await db.Chat_participant.findOne({
    where: {
      user_id: userData.userId,
      friend_id: userData.friendId,
    },
  });

  if (!room) {
    //채팅방이 없는 경우 채팅방과 참가자를 만듦
    const newRoom = await db.Chatting_room.create({ type: 'personal' });

    await db.Chat_participant.create({
      room_id: newRoom.room_id,
      user_id: userData.userId,
      friend_id: userData.friendId,
    });
  }
}

// 단체 채팅방 입장
export async function enterGroupRoom(userData) {
  //참가자 아이디가 없을 경우 유저아이디와 친구들 아이디로 채팅 방을 찾음
  const room = await db.Chat_participant.findAll({
    where: {
      user_id: userData.userId,
      friend_id: {
        [Op.in]: userData.friends,
      },
    },
  });
  if (room.length == 0) {
    //채팅방이 없는 경우 채팅방과 참가자를 만듦
    const newRoom = await db.Chatting_room.create({ type: 'group' });

    console.log('newRoom', newRoom);

    for (const fr of userData.friends) {
      await db.Chat_participant.create({
        room_id: newRoom.room_id,
        user_id: userData.userId,
        friend_id: fr,
      });
    }
  }
}
