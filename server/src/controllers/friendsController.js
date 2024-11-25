import db from '../models';
import database from '../config/mysql';

// 친구 추가를 위한 유저 조회
export async function searchUser(req, res) {
  const { keyword } = req.query;

  try {
    const [result] = await database.query(
      'SELECT account.user_id,account.user_email,account.user_name, profile.profile_img_url, profile.bg_img_url, profile.state_msg FROM account LEFT JOIN profile ON account.user_id = profile.user_id WHERE account.user_email = ?',
      [keyword]
    );

    if (result.length === 0) {
      return res.status(204).json({ message: '검색된 사용자가 없습니다.' });
    }

    return res.status(200).json({ message: '검색 성공', user: result[0] });
  } catch (error) {
    return res.status(500).json({ message: '서버 오류' });
  }
}

//친구 추가
export async function addFriend(req, res) {
  const { friendId, userId, friendName } = req.body;

  try {
    // 이미 친구인지 확인
    const user = await db.Friends.findOne({
      where: { user_id: userId, friend_id: friendId },
    });

    // user가 존재하면 이미 친구이므로 204 상태 코드 반환
    if (user) {
      return res.status(204).json({ message: '이미 추가된 친구입니다.' });
    }

    // 친구 추가
    await db.Friends.create({
      user_id: userId,
      friend_id: friendId,
      friend_name: friendName,
    });

    return res.status(200).json({ message: '친구 추가 성공' });
  } catch (error) {
    console.error('서버 오류:', error);
    return res.status(500).json({ message: '서버 오류' });
  }
}

// 친구 정보 조회
export async function getFriendInfo(req, res) {
  const { friendId, userId } = req.body;

  try {
    const [result] = await database.query(
      'SELECT * LEFT JOIN profile ON friends.friend_id = profile.user_id LEFT JOIN account ON friends.friend_id = account.user_id WHERE friends.user_id = ? and friends.friend_id = ?',
      [userId, friendId]
    );

    if (result.length == 0) {
      return res
        .status(204)
        .json({ message: '해당 친구가 존재하지 않습니다.' });
    }

    let newObj = result[0];

    return res
      .status(200)
      .json({ message: '친구 정보 조회 성공', data: newObj });
  } catch (error) {
    return res.status(500).json({ message: '서버 오류' });
  }
}

//내 친구 리스트 조회
export async function getFriendsList(req, res) {
  const { userId } = req.body;

  try {
    const [result] = await database.query(
      'SELECT friends.friend_id, friends.user_id, friends.friend_name, profile.profile_img_url, profile.bg_img_url, profile.state_msg FROM friends LEFT JOIN profile ON friends.friend_id = profile.user_id LEFT JOIN account ON friends.friend_id = account.user_id WHERE friends.user_id = ?',
      [userId]
    );

    if (result.length == 0) {
      return res.status(204).json({ message: '친구가 존재하지 않습니다.' });
    }

    return res.status(200).json({ message: '친구 조회 성공', data: result });
  } catch (error) {
    return res.status(500).json({ message: '서버 오류' });
  }
}
