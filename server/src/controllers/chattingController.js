import db from '../models';
import database from '../config/mysql';
import { formatDate } from '../utils/dateUtil';

// 메시지 삭제
export async function setDeleteMessage(req, res) {
  const { msg } = req.body;

  try {
    const targetChat = await db.Chatting.findOne({
      where: {
        createdAt: msg.createdAt,
        room_id: msg.room_id,
        user_id: msg.user_id,
      },
    });
    console.log('targetChat', targetChat);

    await db.Chatting.update(
      { del_yn: 'y' },
      { where: { chat_id: targetChat.chat_id } }
    );

    return res.status(200).json({
      message: '메시지 삭제 성공',
      data: { chat_id: targetChat.chat_id },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류' });
  }
}

// 읽지 않은 전체 메시지의 수
export async function getReadNotCount(req, res) {
  const { userId } = req.body;

  try {
    const [result] = await database.query(
      `SELECT 
          SUM(read_n_count) AS total_read_n_count
      FROM (
          SELECT 
              COUNT(mru.chat_id) AS read_n_count
          FROM chat_participant cp
          LEFT JOIN msg_read_user mru 
              ON mru.room_id = cp.room_id 
              AND mru.read_yn = 'n' 
              AND mru.user_id = ?
          WHERE cp.user_id = ?
          GROUP BY cp.room_id
      ) sub`,
      [userId, userId]
    );

    if (result.length === 0) {
      return res.status(204).json({ message: '정보가 존재하지 않습니다.' });
    }

    return res.status(200).json({
      message: '읽지 않은 전체 메시지의 수 조회 성공',
      data: result[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류' });
  }
}

//채팅방 리스트 조회(여러개)
export async function getChattingList(req, res) {
  const { userId } = req.body;

  try {
    // const [result] = await database.query(
    //   'SELECT chatting.message, chatting.createdAt, chat_participant.room_id, chatting_room.room_name, chat_participant.friend_id FROM chat_participant LEFT JOIN chatting_room ON chat_participant.room_id = chatting_room.room_id LEFT JOIN chatting ON chat_participant.room_id = chatting.room_id WHERE chat_participant.user_id = ?',
    //   [userId]
    // );
    const [result] = await database.query(
      `SELECT 
          c.message,
          c.createdAt AS chat_createdAt,
          c.chat_id,
          COUNT(mru.chat_id) AS read_n_count,
          cp.room_id, 
          cr.room_name, 
          cp.friend_id
      FROM chat_participant cp
      LEFT JOIN chatting_room cr ON cp.room_id = cr.room_id
      LEFT JOIN chatting c ON c.room_id = cp.room_id
          AND c.createdAt = (SELECT MAX(c2.createdAt) 
                            FROM chatting c2 
                            WHERE c2.room_id = cp.room_id)
      LEFT JOIN msg_read_user mru ON mru.room_id = cr.room_id AND mru.read_yn = 'n' AND mru.user_id = ?
      WHERE cp.user_id = ?
      GROUP BY cp.room_id, cr.room_name, cp.friend_id, c.chat_id, c.message, c.createdAt;`,
      [userId, userId]
    );

    if (result.length === 0) {
      return res.status(204).json({ message: '정보가 존재하지 않습니다.' });
    }

    const groupedData = {};

    console.log('getChattingList result', result);

    // `result` 순회
    for (const item of result) {
      if (!groupedData[item.room_id]) {
        groupedData[item.room_id] = {
          room_id: item.room_id,
          room_name: item.room_name,
          last_message_chat_id: item.chat_id,
          last_message: item.message,
          last_message_created_at: formatDate(item.chat_createdAt),
          read_n_count: item.read_n_count,
          images: [],
          ids: [userId],
        };
      }

      // 각 friend_id에 대해 프로필 정보 조회
      const [result2] = await database.query(
        'SELECT account.user_id, account.user_name, profile.profile_img_url FROM account LEFT JOIN profile ON account.user_id = profile.user_id WHERE account.user_id = ?',
        [item.friend_id]
      );

      // console.log('item.friend_id', item.friend_id);
      console.log('getChattingList result2', result2);

      const friendData = result2[0] || {};
      groupedData[item.room_id].images.push(friendData.profile_img_url || null);
      groupedData[item.room_id].ids.push(friendData.user_id || null);
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

//채팅방 조회(단일)
export async function getChatRoomInfo(req, res) {
  const { userId, roomId } = req.body;

  try {
    const [result] = await database.query(
      `SELECT 
          c.message,
          c.createdAt,
          cp.room_id,
          cr.room_name,
          cp.friend_id
      FROM chatting_room cr
      LEFT JOIN chat_participant cp ON cp.room_id = cr.room_id
      LEFT JOIN (
          SELECT 
              room_id, 
              message, 
              createdAt
          FROM chatting 
          WHERE (room_id, createdAt) IN (
              SELECT room_id, MAX(createdAt) 
              FROM chatting 
              GROUP BY room_id
          )
      ) c ON c.room_id = cr.room_id
      WHERE cr.room_id = ? AND cp.user_id = ?;`,
      [roomId, userId]
    );

    if (result.length === 0) {
      return res.status(204).json({ message: '정보가 존재하지 않습니다.' });
    }

    const groupedData = {};
    console.log('resultresult', result);
    // `result` 순회
    for (const item of result) {
      if (!groupedData[item.room_id]) {
        groupedData[item.room_id] = {
          room_id: item.room_id,
          room_name: item.room_name,
          last_message: item.last_message,
          last_message_created_at: item.last_message_created_at,
          images: [],
          ids: [userId],
        };
      }

      // 각 friend_id에 대해 프로필 정보 조회
      const [result2] = await database.query(
        'SELECT friends.friend_id, friends.friend_name, profile.profile_img_url FROM friends LEFT JOIN profile ON friends.friend_id = profile.user_id WHERE friends.friend_id = ?',
        [item.friend_id]
      );
      console.log('result2result2', result2);
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
  const { roomId, lastId, pageSize } = req.query;
  try {
    let query = '';
    let result = [];
    if (lastId) {
      query = `SELECT 
        chatting.chat_id, 
        chatting.message, 
        chatting.createdAt, 
        chatting.del_yn, 
        chatting.room_id, 
        chatting.user_id, 
        account.user_name, 
        profile.profile_img_url 
       FROM chatting 
       LEFT JOIN account ON chatting.user_id = account.user_id 
       LEFT JOIN profile ON chatting.user_id = profile.user_id 
       WHERE chatting.room_id = ? AND chat_id < ?
       ORDER BY chatting.chat_id DESC
       LIMIT ?`;
      [result] = await database.query(query, [
        roomId,
        lastId,
        Number(pageSize),
      ]);
    } else {
      query = `SELECT 
        chatting.chat_id, 
        chatting.message, 
        chatting.createdAt, 
        chatting.del_yn, 
        chatting.room_id, 
        chatting.user_id, 
        account.user_name, 
        profile.profile_img_url 
       FROM chatting 
       LEFT JOIN account ON chatting.user_id = account.user_id 
       LEFT JOIN profile ON chatting.user_id = profile.user_id 
       WHERE chatting.room_id = ?
       ORDER BY chatting.chat_id DESC
       LIMIT ?`;
      [result] = await database.query(query, [roomId, Number(pageSize)]);
    }

    // 1. 기본 메시지 정보 조회

    if (result.length === 0) {
      return res
        .status(204)
        .json({ message: '정보가 존재하지 않습니다.', data: [] });
    }

    result.sort((a, b) => a.chat_id - b.chat_id);

    // 2. 메시지 읽지 않은 유저 정보 조회
    const chatIds = result.map((rs) => rs.chat_id);
    const [readUsers] = await database.query(
      `SELECT 
        mru.chat_id, 
        mru.user_id 
       FROM msg_read_user as mru 
       WHERE mru.chat_id IN (?) AND read_yn = 'n'`,
      [chatIds]
    );

    // 3. 메시지에 읽지않은 유저 정보 매핑
    const newArr = result.map((rs) => {
      const readUserList = readUsers
        .filter((ru) => ru.chat_id === rs.chat_id)
        .map((ru) => ru.user_id);
      return { ...rs, read_not_user: readUserList };
    });

    return res
      .status(200)
      .json({ message: '메세지 리스트 조회 성공', result: newArr });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류' });
  }
}

//채팅 메시지 저장
export async function setChatMessage(req, res) {
  //  if (req.method.toUpperCase() === 'OPTIONS') return;
  const { msg } = req.body;
  try {
    // 이미 메시지가 DB에 저장된 상태인지 확인
    const existingMessage = await db.Chatting.findOne({
      where: {
        user_id: msg.user_id,
        message: msg.message,
        createdAt: new Date(),
      },
    });

    if (existingMessage) {
      console.log('이미 저장된 메시지입니다.');
      return; // 중복 메시지 방지
    }

    // 메시지 추가
    const newChat = await db.Chatting.create({
      user_id: msg.user_id,
      room_id: msg.room_id,
      message: msg.message,
      del_yn: msg.del_yn,
    });

    // 읽지 않은 사람
    msg.participant.forEach(async (participantId) => {
      msg.read_not_user.forEach(async (readNotUser) => {
        db.Msg_read_user.create({
          chat_id: newChat.chat_id,
          user_id: participantId,
          room_id: msg.room_id,
          read_yn: participantId == readNotUser ? 'n' : 'y',
        });
      });
    });

    return res.status(200).json({ message: '채팅 메시지 저장 성공' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류' });
  }
}
