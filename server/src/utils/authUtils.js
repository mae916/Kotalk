import jwt from 'jsonwebtoken';

// 비밀키와 만료 시간은 환경 변수에서 가져옴
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

// 토큰 생성 함수
export const generateTokens = (user) => {
  // 환경 변수 확인
  if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
    throw new Error(
      'ACCESS_TOKEN_SECRET 또는 REFRESH_TOKEN_SECRET이 설정되지 않았습니다.'
    );
  }

  // 사용자 데이터 검증
  if (!user || !user.user_id || !user.user_email || !user.user_name) {
    throw new Error('유효하지 않은 사용자 데이터입니다.');
  }

  // 엑세스 토큰 생성
  const access_token = jwt.sign(
    {
      sub: user.user_id, // 사용자 ID (subject)
      email: user.user_email, // 이메일
      name: user.user_name, // 사용자 이름
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  // 리프레시 토큰 생성 (필요 최소한의 정보만 포함)
  const refresh_token = jwt.sign(
    {
      sub: user.user_id, // 사용자 ID (subject)
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  return { access_token, refresh_token };
};
