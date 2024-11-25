import db from '../models';
import database from '../config/mysql';

// 상태 메시지 변경
export async function setStateMsg(req, res) {
  const { user_id, state_msg } = req.body;
  try {
    await db.Profile.update({ state_msg }, { where: { user_id: user_id } });
    return res.status(200).json({ message: '변경 성공' });
  } catch (error) {
    return res.status(500).json({ message: '서버 오류' });
  }
}
