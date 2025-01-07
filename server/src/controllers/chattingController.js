import db from '../models';
import database from '../config/mysql';

//채팅방 리스트 조회
export async function getChattingList(req, res) {
  const { userId } = req.body;

  try {
    const [result] = await database.query(
      'SELECT chat_participant.room_id, chatting_room.room_name, chat_participant.friend_id, chatting_room.last_message, chatting_room.last_message_created_at FROM chat_participant LEFT JOIN chatting_room ON chat_participant.room_id = chatting_room.room_id WHERE chat_participant.user_id = ?',
      [userId]
    );

    if (result.length === 0) {
      return res.status(204).json({ message: '정보가 존재하지 않습니다.' });
    }

    const groupedData = {};

    // `result` 순회
    for (const item of result) {
      if (!groupedData[item.room_id]) {
        groupedData[item.room_id] = {
          room_id: item.room_id,
          room_name: item.room_name,
          last_message: item.last_message,
          last_message_created_at: item.last_message_created_at,
          images: [],
          ids: [],
        };
      }

      // 각 friend_id에 대해 프로필 정보 조회
      const [result2] = await database.query(
        'SELECT friends.friend_name, profile.profile_img_url FROM friends LEFT JOIN profile ON friends.friend_id = profile.user_id WHERE friends.friend_id = ?',
        [item.friend_id]
      );

      const friendData = result2[0] || {};
      groupedData[item.room_id].images.push(friendData.profile_img_url || null);
      groupedData[item.room_id].ids.push(friendData.friend_id || null);
    }

    // `Object.values`로 데이터 배열로 변환
    const groupedDataArray = Object.values(groupedData);

    return res
      .status(200)
      .json({ message: '채팅 리스트 조회 성공', data: groupedDataArray });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류' });
  }
}

//채팅방 조회
export async function getChatRoomInfo(req, res) {
  const { roomId } = req.body;

  try {
    const [result] = await database.query(
      'SELECT chat_participant.room_id, chatting_room.room_name, chat_participant.friend_id, chatting_room.last_message, chatting_room.last_message_created_at FROM chat_participant LEFT JOIN chatting_room ON chat_participant.room_id = chatting_room.room_id WHERE chatting_room.room_id = ?',
      [roomId]
    );

    if (result.length === 0) {
      return res.status(204).json({ message: '정보가 존재하지 않습니다.' });
    }

    const groupedData = {};

    // `result` 순회
    for (const item of result) {
      if (!groupedData[item.room_id]) {
        groupedData[item.room_id] = {
          room_id: item.room_id,
          room_name: item.room_name,
          last_message: item.last_message,
          last_message_created_at: item.last_message_created_at,
          images: [],
          ids: [],
        };
      }

      // 각 friend_id에 대해 프로필 정보 조회
      const [result2] = await database.query(
        'SELECT friends.friend_name, friends.friend_id, profile.profile_img_url FROM friends LEFT JOIN profile ON friends.friend_id = profile.user_id WHERE friends.friend_id = ?',
        [item.friend_id]
      );

      const friendData = result2[0] || {};
      groupedData[item.room_id].images.push(friendData.profile_img_url || null);
      groupedData[item.room_id].ids.push(friendData.friend_id || null);
    }

    // `Object.values`로 데이터 배열로 변환
    const groupedDataArray = Object.values(groupedData);

    return res
      .status(200)
      .json({ message: '채팅 리스트 조회 성공', data: groupedDataArray[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류' });
  }
}

// 개인채팅방 생성여부 확인 후 room_id를 반환
export async function createPersonalRoom(req, res) {
  const { userId, friendId } = req.body;

  try {
    // 친구 아이디와 유저아이디로 존재하는 채팅방 있는지 확인
    const [room] = await database.query(
      'SELECT * FROM chat_participant as participant LEFT JOIN chatting_room as room ON participant.room_id = room.room_id WHERE participant.user_id = ? and participant.friend_id = ? and room.type = ?',
      [userId, friendId, 'personal']
    );

    let newRoom;

    //채팅방이 없는 경우 채팅방과 참가자를 만듦
    if (room.length == 0) {
      const friend = await db.Friends.findOne({
        where: {
          friend_id: friendId,
        },
      });

      newRoom = await db.Chatting_room.create({
        type: 'personal',
        room_name: friend.friend_name,
      });

      //내 방과
      await db.Chat_participant.create({
        room_id: newRoom.room_id,
        user_id: userId,
        friend_id: friendId,
      });

      //친구의 방을 만듦
      await db.Chat_participant.create({
        room_id: newRoom.room_id,
        user_id: friendId,
        friend_id: userId,
      });
    }

    const data = {
      room_id: room.length == 0 ? newRoom.room_id : room[0].room_id,
    };

    return res
      .status(200)
      .json({ message: '채팅방 생성 혹은 채팅방 조회 성공', data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류' });
  }
}

//메세지 리스트 조회
export async function getMsgList(req, res) {
  const { roomId } = req.body;
  try {
    const [result] = await database.query(
      'SELECT chatting.message, chatting.send_date, chatting.del_yn, chatting.room_id, chatting.user_id, account.user_name, profile.profile_img_url FROM chatting LEFT JOIN account ON chatting.user_id = account.user_id LEFT JOIN profile ON chatting.user_id = profile.user_id WHERE chatting.room_id = ? ORDER BY chatting.send_date ASC',
      [roomId]
    );

    if (result.length === 0) {
      return res.status(204).json({ message: '정보가 존재하지 않습니다.' });
    }

    return res.status(200).json({ message: '메세지 리스트 조회 성공', result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류' });
  }
}

//채팅 메시지 저장
export async function setChatMessage(req, res) {
  const { msgList } = req.body;
  try {
    msgList.forEach(async (msg) => {
      const newChat = await db.Chatting.create({
        user_id: msg.user_id,
        room_id: msg.room_id,
        message: msg.message,
        del_yn: msg.del_yn,
        send_date: msg.send_date,
      });

      // 메시지 추가
      await db.Msg_read_user.create({
        chat_id: newChat.chat_id,
        user_id: userId,
        room_id: roomId,
      });
    });
    return res.status(200).json({ message: '채팅 메시지 저장 성공' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류' });
  }
}
