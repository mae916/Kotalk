import db from '../models';
import database from '../config/mysql';
import jwt from 'jsonwebtoken';
import { generateTokens } from '../utils/authUtils';
import { mySqlNowDateTime } from '../utils/dateUtil';
const bcrypt = require('bcrypt');

const saltRounds = 10;

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const DEV_SERVER_HOST = process.env.DEV_SERVER_HOST;

//로그인
export async function login(req, res) {
  const { user_email, password } = req.body;

  try {
    // 사용자 찾기
    const user = await db.Account.findOne({
      raw: true,
      where: { user_email },
    });

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: '비밀번호가 틀렸습니다.' });
    }

    const { access_token, refresh_token } = generateTokens(user);
    const date = mySqlNowDateTime(); // 날짜 포맷

    // 리프레시 토큰 및 마지막 로그인 날짜 업데이트
    await db.Account.update(
      { refresh_token, last_login_date: date },
      { where: { user_id: user.user_id } }
    );

    // 쿠키 설정
    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 1일
      sameSite: 'none',
    });

    const [result] = await database.query(
      'SELECT account.user_id,account.user_email,account.user_name, profile.profile_img_url, profile.bg_img_url, profile.state_msg FROM account LEFT JOIN profile ON account.user_id = profile.user_id WHERE account.user_id = ?',
      [user.user_id]
    );
    let newObj = result[0];
    newObj = { ...newObj, access_token };

    return res.status(200).json({ message: '로그인 성공', data: newObj });
  } catch (err) {
    console.error('서버 에러:', err);
    return res.status(500).json({ message: '서버 오류' });
  }
}

//회원가입
export async function join(req, res) {
  const { user_email, password, user_name } = req.body;

  // 필드 유효성 검사
  if (!user_email || !password || !user_name) {
    return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
  }

  try {
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const date = mySqlNowDateTime(); // 날짜 포맷 (mySqlNowDateTime은 날짜 포맷 함수)

    // 시퀄라이즈를 사용하여 계정 생성
    const newAccount = await db.Account.create({
      user_email,
      password: hashedPassword,
      user_name,
      join_date: date, // 가입 날짜
    });

    await db.Profile.create({
      user_id: newAccount.user_id,
      profile_img_url: `${DEV_SERVER_HOST}/assets/images/profile.jpg`,
      bg_img_url: `${DEV_SERVER_HOST}/assets/images/bg.png`,
      state_msg: '', // 가입 날짜
    });

    // 성공 응답
    return res.status(201).json({
      message: '회원가입 성공',
      data: { userId: newAccount.user_id },
    });
  } catch (err) {
    console.error('회원가입 중 오류 발생:', err);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}

// 엑세스 토큰 재발급
export async function getAccessToken(req, res) {
  const { refreshToken } = req.cookies;

  // 리프레시 토큰이 없을 경우 처리
  if (!refreshToken) {
    return res.status(400).json({ message: '리프레시 토큰을 제공해 주세요.' });
  }

  try {
    // 시퀄라이즈를 사용하여 리프레시 토큰 확인
    const user = await db.Account.findOne({
      where: { refresh_token: refreshToken },
    });

    // 리프레시 토큰이 만료되었거나 존재하지 않을 경우
    if (!user) {
      return res.status(401).json({ message: '로그인 해주세요.' });
    }

    // 새 액세스 토큰 발급
    const accessToken = jwt.sign(
      {
        id: user.user_id, // 사용자 ID (subject)
        email: user.user_email, // 이메일
        name: user.user_name, // 사용자 이름
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    // 토큰 발급 성공 응답
    return res.status(200).json({
      message: '토큰 발급 성공',
      data: { accessToken },
    });
  } catch (error) {
    console.error('토큰 발급 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}

// JWT 검증 미들웨어
export function verifyAccessToken(req, res, next) {
  // 쿠키에서 토큰 추출
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send('엑세스 토큰이 필요합니다.');
  }

  // 토큰 검증
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send('토큰이 유효하지 않습니다.');
    }
    req.user = { ...user, token }; // 사용자 정보를 요청 객체에 추가
    next(); // 다음 미들웨어로 전달
  });
}

// 유저 정보 조회
export async function getUser(req, res, next) {
  const { sub, token } = req.user;

  try {
    const [result] = await database.query(
      'SELECT account.user_id,account.user_email,account.user_name, profile.profile_img_url, profile.bg_img_url, profile.state_msg FROM account LEFT JOIN profile ON account.user_id = profile.user_id WHERE account.user_id = ?',
      [sub]
    );

    if (result.length == 0) {
      return res
        .status(204)
        .json({ message: '유저 정보가 존재하지 않습니다.' });
    }

    return res.status(200).json({
      message: '유저 정보 조회 성공',
      data: { ...result[0], access_token: token },
    });
  } catch (error) {
    console.log('error');
    return res.status(500).json({ message: '서버 오류' });
  }
}
