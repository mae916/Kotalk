import db from '../models';
import database from '../config/mysql';

//채팅방 리스트 조회
export async function getChattingList(req, res) {
  const { userId } = req.body;

  try {
    const [result] = await database.query(
      'SELECT chat_participant.user_id,chat_participant.friend_id,chat_participant.room_id,chatting_room.last_message,chatting_room.last_message_created_at,profile.profile_img_url FROM chat_participant LEFT JOIN chatting_room ON chat_participant.room_id = chatting_room.room_id LEFT JOIN profile ON chat_participant.friend_id = profile.user_id WHERE chat_participant.user_id = ?',
      [userId]
    );

    if (result.length == 0) {
      return res.status(204).json({ message: '정보가 존재하지 않습니다.' });
    }

    return res
      .status(200)
      .json({ message: '채팅 리스트 조회 성공', data: result });
  } catch (error) {
    return res.status(500).json({ message: '서버 오류' });
  }
}
