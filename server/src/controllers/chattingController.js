import db from '../../models';
import database from '../../config/mysql';
import { formatDate, mySqlNowDateTime } from '../utils/dateUtil';
import {
  getRoomInfo,
  isRemainUserExist,
  prepareRoomEntry,
  getRoomInfoList,
  getUserProfiles,
  getUserNames,
  getReadNotMsg,
  getUserRoomCreatedAt,
  getLatestChatting,
} from '../services/chatService';

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
  console.log('getChattingList userId', userId);

  try {
    const result = await getRoomInfoList(userId);

    if (result.length === 0) {
      return res.status(204).json({ message: '정보가 존재하지 않습니다.' });
    }

    const roomIds = result.map((room) => room.room_id);
    const result1 = await getLatestChatting(userId, roomIds);
    const result2 = await getReadNotMsg(userId);

    const data = await Promise.all(
      result.map(async (room) => {
        console.log('getChattingList room', room);
        room.user_ids = room.user_ids.split(',').map((id) => parseInt(id, 10));
        let friendIds = room.user_ids.filter((user) => user !== userId);

        if (friendIds.length == 0) {
          //나와의 채팅인 경우
          friendIds = [userId];
        }
        room.images = await getUserProfiles(friendIds);
        room.room_name = await getUserNames(friendIds);
        room.room_key = `${room.room_uuid}_${room.room_id}`;

        const matched = result1.find((item) => item.room_id === room.room_id);
        room.last_message = matched ? matched.message : '';
        room.last_message_date = matched ? formatDate(matched.createdAt) : '';

        const matched2 = result2.find((item) => item.room_id === room.room_id);
        room.read_n_count = matched2 ? matched2.read_n_count : 0;
        return room;
      })
    );
    return res.status(200).json({ message: '채팅 리스트 조회 성공', data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류' });
  }
}

//채팅방 조회(단일)
export async function getChatRoomInfo(req, res) {
  const { userId, roomId } = req.body;

  try {
    const result = await getRoomInfo(roomId);

    console.log('getChatRoomInfo', result);

    if (result.length === 0) {
      return res.status(204).json({ message: '정보가 존재하지 않습니다.' });
    }

    const data = await Promise.all(
      result.map(async (room) => {
        room.user_ids = room.user_ids.split(',').map((id) => parseInt(id, 10));
        room.createdAt = formatDate(room.createdAt);
        let friendIds = room.user_ids.filter((user) => user !== userId);

        if (friendIds.length == 0) {
          //나와의 채팅인 경우
          friendIds = [userId];
        }
        room.images = await getUserProfiles(friendIds);
        room.room_name = await getUserNames(friendIds);
        room.room_key = `${room.room_uuid}_${room.room_id}`;
        return room;
      })
    );
    return res
      .status(200)
      .json({ message: '채팅 리스트 조회 성공', data: data[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류' });
  }
}

// 나와의 채팅방 생성여부 확인 후 room_id를 반환
// export async function createAloneRoom(req, res) {
//   const { userId } = req.body;

//   try {
//     // 유저아이디로 존재하는 채팅방 있는지 확인
//     const [room] = await database.query(
//       'SELECT * FROM chat_participant as participant LEFT JOIN chatting_room as room ON participant.room_id = room.room_id WHERE participant.user_id = ? and room.type = ?',
//       [userId, 'alone']
//     );

//     let newRoom;

//     //채팅방이 없는 경우 채팅방과 참가자를 만듦
//     if (room.length == 0) {
//       const user = await db.Account.findOne({
//         where: {
//           user_id: userId,
//         },
//       });

//       newRoom = await db.Chatting_room.create({
//         type: 'alone',
//         room_name: user.user_name,
//       });

//       //내 방 만들기
//       await db.Chat_participant.create({
//         room_id: newRoom.room_id,
//         user_id: userId,
//         friend_id: userId,
//       });
//     }

//     const data = {
//       room_id: room.length == 0 ? newRoom.room_id : room[0].room_id,
//     };

//     return res
//       .status(200)
//       .json({ message: '나와의 채팅방 생성 혹은 채팅방 조회 성공', data });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: '서버 오류' });
//   }
// }

//메세지 리스트 조회
export async function getMsgList(req, res) {
  const { roomId, userId, lastId, pageSize } = req.query;
  console.log('getMsgList', roomId, lastId, pageSize);
  const createdDate = await getUserRoomCreatedAt(roomId, userId);
  console.log('createdDate', createdDate);
  //TODO: 아니면 chat_participant의 createdAt의 값을가져와서 그것이상의 채팅메시지를 가져온다 -> 이게 더 간단할듯
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
       WHERE chatting.room_id = ? AND chatting.createdAt > ? AND chat_id < ? 
       ORDER BY chatting.chat_id DESC
       LIMIT ?`;
      [result] = await database.query(query, [
        roomId,
        createdDate.createdAt,
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
       WHERE chatting.room_id = ? AND chatting.createdAt > ? 
       ORDER BY chatting.chat_id DESC
       LIMIT ?`;
      [result] = await database.query(query, [
        roomId,
        createdDate.createdAt,
        Number(pageSize),
      ]);
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

// 채팅방 나가기
export async function leaveRoom(req, res) {
  const { roomId, userId } = req.body;

  try {
    // 존재하는 채팅방 있는지 확인
    const room = await db.Chatting_room.findOne({
      room_id: roomId,
    });

    if (room.length == 0) {
      return res.status(403).send('채팅방이 존재하지 않습니다.');
    }

    const date = mySqlNowDateTime(); // 날짜 포맷

    //떠난 날짜 기록
    await db.Chat_participant.update(
      { leftAt: date },
      {
        where: { room_id: roomId, user_id: userId },
      }
    );

    // 채팅방에 남은 사람 있는지 확인
    const remainUsers = isRemainUserExist(roomId);

    //채팅방에 남은 사람 없으면 채팅방 삭제
    if (remainUsers.length == 0) {
      await db.Chatting_room.update(
        { deletedAt: date },
        {
          where: { room_id: roomId },
        }
      );
    }
    // const data = {
    //   room_id: room.length == 0 ? newRoom.room_id : room[0].room_id,
    // };

    return res.status(200).json({ message: '채팅방 나가기 성공' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류' });
  }
}

// 채팅방 입장 (배열로 받음)
export async function enterRoom(req, res) {
  const { users } = req.body; // 채팅방에 참여할 사람

  try {
    if (users.length == 0) {
      return res
        .status(401)
        .json({ message: '선택한 참여자가 없습니다.', data: rooms });
    }

    const roomId = await prepareRoomEntry(users);
    let roomInfo = await getRoomInfo(roomId);

    console.log('roomInfo', roomInfo);

    // roomInfo가 undefined인 경우, 값이 나올 때까지 반복 실행
    let retries = 0;
    while (!roomInfo[0].user_ids && retries < 5) {
      // 최대 5번 반복
      console.log('roomInfo가 없음. 재시도 중...');
      roomInfo = await getRoomInfo(roomId);
      retries++;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 대기 후 재시도
    }

    console.log('roomInfo', roomInfo);

    roomInfo.forEach((room) => {
      room.user_ids = room.user_ids.split(',').map((id) => parseInt(id, 10));
    });

    return res
      .status(200)
      .json({ message: '채팅방 생성 및 조회 성공', data: roomInfo[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류' });
  }
}

//모든 참여중인 채팅방의 읽지 않은 메시지 수를 보여줌
export async function getReadNotMsgList(req, res) {
  const { userId } = req.body;
  try {
    const rooms = await getReadNotMsg(userId);

    console.log('getReadNotMsgList', rooms);

    return res.status(200).json({
      message: '전체 채팅방의 읽지 않은 메시지 수 조회 성공',
      data: rooms,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류' });
  }
}
