import { Op } from 'sequelize';
import db, { sequelize } from '../../models';
import { v4 as uuidv4 } from 'uuid';

// 참여자의 방 생성 날짜를 가져옴
export async function getUserRoomCreatedAt(roomId, userId) {
  const room = await db.Chat_participant.findOne({
    where: {
      user_id: userId,
      room_id: roomId,
      leftAt: {
        [Op.is]: null, // leftAt이 null인 경우
      },
    },

    attributes: ['createdAt'],
    raw: true,
  });

  return room;
}

// 참여자 아이디로 존재하는 모든 채팅방 확인
export async function isPersonalRoomExist(users) {
  const rooms = await db.Chat_participant.findAll({
    where: { user_id: { [Op.in]: users } }, // userId가 하나라도 포함된 채팅방 찾기
    attributes: ['room_id'],
    raw: true,
  });

  return rooms;
}

// 참여자 아이디 모두가 같이 참여하고(했던) 있는 채팅방(삭제된 채팅방 제외) 모두 가져옴(alone,personal,group)
export async function isParticipantRoomExist(users, type) {
  const userCount = users.length; // users 배열 길이

  const rooms = await db.sequelize.query(
    `SELECT cp.room_id
      FROM Chat_participant AS cp
      JOIN Chatting_room AS cr ON cp.room_id = cr.room_id
      WHERE cp.user_id IN (:users) 
        AND cr.type = :type
        AND cr.deletedAt IS NULL
      GROUP BY cp.room_id
      HAVING COUNT(DISTINCT cp.user_id) = :userCount`, // 모든 users가 포함된 room_id만 가져옴(다른유저가 포함된 방은 가져오지 않음)
    {
      replacements: { users, type, userCount },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  return rooms;
}

// 채팅방을 떠난 사람이 있는지 확인 -> 떠난 사람 반환 - room_id로
export async function isLeftUserExist(roomIds) {
  const leftUsers = await db.Chat_participant.findAll({
    where: {
      room_id: { [Op.in]: roomIds },
      leftAt: {
        [Op.not]: null, // leftAt이 null이 아닌 경우
      },
    },
    attributes: ['room_id', 'user_id', 'leftAt'],
    raw: true,
  });

  return leftUsers;
}

// 채팅방에 남아 있는 사람이 있는지 확인 -> 남아있는 사람 반환 - room_id로
export async function isRemainUserExist(roomIds) {
  const leftUsers = await db.Chat_participant.findAll({
    where: {
      room_id: { [Op.in]: roomIds },
      leftAt: {
        [Op.is]: null, // leftAt가 null인 경우
      },
    },
    attributes: ['room_id', 'user_id', 'leftAt'],
    raw: true,
  });

  return leftUsers;
}

export async function createRoom(users, type) {
  // 채팅방 만들기
  const newRoom = await db.Chatting_room.create({
    type,
    room_uuid: `${uuidv4()}`,
  });

  //참가자 목록 만들기
  users.forEach(async (user) => {
    await db.Chat_participant.create({
      room_id: newRoom.room_id,
      user_id: user,
    });
  });

  return newRoom.room_id;
}

//여러 room_id를 배열로 받아서 방의 정보 조회
export async function getRoomInfo(roomIds) {
  const rooms = await db.sequelize.query(
    `SELECT 
        cr.room_id,
        cr.room_uuid,
        cr.type,
        GROUP_CONCAT(DISTINCT cp.user_id) AS user_ids,
        ANY_VALUE(c.message) AS message, 
        ANY_VALUE(c.createdAt) AS createdAt
    FROM chatting_room AS cr
    LEFT JOIN chat_participant AS cp ON cp.room_id = cr.room_id
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
    ) AS c ON c.room_id = cr.room_id
    WHERE cr.room_id IN (:roomIds)
    GROUP BY cr.room_id, cr.room_uuid, cr.type`,
    {
      replacements: { roomIds },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  return rooms;
}

//하나의 user_id를 받아서 방의 정보 조회
export async function getRoomInfoList(userId) {
  const rooms = await db.sequelize.query(
    `SELECT 
        cr.room_id,
        cr.room_uuid,
        cr.type,
        GROUP_CONCAT(DISTINCT cp.user_id) AS user_ids
    FROM chat_participant AS cp
    LEFT JOIN chatting_room AS cr ON cp.room_id = cr.room_id
    WHERE cp.room_id IN (
        SELECT room_id
        FROM chat_participant
        WHERE user_id = :userId
    ) 
    AND cp.user_id = :userId
    AND cp.leftAt IS NULL
    GROUP BY cr.room_id, cr.room_uuid, cr.type;
`,
    {
      replacements: { userId },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  return rooms;
}

//모든 채팅방들의 최신 메시지와 createdAt 가져오기
export async function getLatestChatting(userId, roomIds) {
  console.log('userId', userId);
  console.log('roomIds', roomIds);
  const chattings = await db.sequelize.query(
    `SELECT 
        ch.room_id, 
        ch.message, 
        ch.createdAt
    FROM chatting AS ch
    LEFT JOIN chat_participant AS cp 
        ON ch.room_id = cp.room_id 
        AND ch.user_id = cp.user_id
    WHERE cp.user_id = :userId
      AND cp.room_id IN (:roomIds)
      AND cp.leftAt IS NULL
      AND (ch.room_id, ch.createdAt) IN (
            SELECT 
                chatting.room_id, 
                MAX(chatting.createdAt) 
            FROM chatting
            LEFT JOIN chat_participant AS part
                ON chatting.room_id = part.room_id
            WHERE part.leftAt IS NULL
              AND chatting.createdAt > (
                  SELECT MAX(createdAt)
                  FROM chat_participant AS part 
                  WHERE part.leftAt IS NULL
                  AND part.room_id = chatting.room_id
              )
            GROUP BY chatting.room_id
        );`,
    {
      replacements: { userId, roomIds },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  return chattings;
}

// 나간 유저들 배열화
// const leftUsers = users.filter(
//   (user) => !rooms.some((room) => room.user_id === user) // rooms에서 해당 user_id가 있는지 확인
// );

// if (leftUsers.length == 1) {
//   roomId = leftUsers[0].room_id;
//   break; // 나간 사용자가 있는 방을 찾으면 반복 종료
// }

// 방 입장 전 준비 작업
// 개인채팅방 생성여부 확인 후 없으면 채팅방 생성, 참여목록 존재여부 확인 후 없으면 참여자 생성(user_id, friend_id로 조회)
export async function prepareRoomEntry(users) {
  let roomId;
  console.log('prepareRoomEntry users', users);
  //나만의 채팅방
  if (users.length == 1) {
    const rooms = await isParticipantRoomExist(users, 'alone');
    console.log('prepareRoomEntry rooms', rooms);
    //방이 없는 경우
    if (rooms.length == 0) {
      roomId = await createRoom(users, 'alone');
    } else {
      //방이 존재하는 경우
      roomId = rooms[0].room_id;
    }
  } else if (users.length == 2) {
    //개인채팅방
    const rooms = await isParticipantRoomExist(users, 'personal');
    if (rooms.length == 0) {
      roomId = await createRoom(users, 'personal');
    } else {
      // 방에 남아있는 사람 반환
      const roomIds = rooms.map((room) => room.room_id);
      const remainUsers = await isRemainUserExist(roomIds);
      roomId = remainUsers[0].room_id;

      //방에 혼자만 남았을 경우(떠난 사람이 있음)
      if (remainUsers.length == 1) {
        //떠난 유저 찾기
        const leftUser = users.filter(
          (user) =>
            !remainUsers.some((remainUser) => remainUser.user_id === user)
        );

        if (leftUser) {
          //나간 유저의 참가자 목록 만들기
          await db.Chat_participant.create({
            room_id: roomId,
            user_id: leftUser[0],
          });
        }
      }
    }
  } else {
    //그룹채팅방
    // let rooms = isParticipantRoomExist(users, 'group');
  }
  console.log('roomId', roomId);
  return roomId;
}

// 유저가 속한 방들을 조회
export async function getUserRooms(userId) {
  const rooms = await db.Chat_participant.findAll({
    attributes: ['room_id'],
    where: { user_id: userId },
    raw: true,
  });
  const roomIds = rooms.map((room) => room.room_id);
  return roomIds;
}

// user_id들의 프로필을 조회
export async function getUserProfiles(userIds) {
  const userInfo = await db.Profile.findAll({
    where: {
      user_id: { [Op.in]: userIds },
    },
    attributes: ['profile_img_url'],
    raw: true,
  });
  const imgs = userInfo.map((info) => info.profile_img_url);
  return imgs;
}

// 참가자들의 이름 가져오기
export async function getUserNames(userIds) {
  const userInfo = await db.Account.findAll({
    where: {
      user_id: { [Op.in]: userIds },
    },
    attributes: ['user_name'],
    raw: true,
  });
  const names = userInfo.map((info) => info.user_name).join(',');
  return names;
}

// 모든 참여중인 채팅방의 읽지 않은 메시지 수를 보여줌
export async function getReadNotMsg(userId) {
  const rooms = await db.sequelize.query(
    `SELECT 
          cr.room_id,
          COUNT(mru.chat_id) AS read_n_count
      FROM chatting_room AS cr
      LEFT JOIN msg_read_user AS mru 
          ON mru.room_id = cr.room_id 
          AND mru.read_yn = 'n' 
          AND mru.user_id = :userId
      WHERE cr.room_id IN (
          SELECT room_id
          FROM chat_participant
          WHERE user_id = :userId
      )
      GROUP BY cr.room_id;`,
    {
      replacements: { userId },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );
  return rooms;
}
