import db from '../models';
// import database from '../config/mysql';

// 프로필 변경
export async function setProfile(req, res) {
  const file = req.file;
  const userId = req.body.user_id;

  const realPath = `${process.env.DEV_SERVER_HOST}/uploads/profile/${file.filename}`;
  try {
    await db.Profile.update(
      { profile_img_url: realPath },
      { where: { user_id: userId } }
    );
    return res.status(200).json({ message: '프로필 변경 성공' });
  } catch (error) {
    return res.status(500).json({ message: '서버 오류' });
  }
}
