import axios from 'axios';
import { IUser } from '../types';

//로그인
export async function loginAxios(userData: IUser) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/login`,
      userData,
      {
        headers: {
          'Content-Type': 'application/json', // JSON 형식으로 보내기
        },
        withCredentials: true, // 쿠키 포함
      }
    );

    // 서버에서 받은 응답을 반환
    return response.data;
  } catch (error) {
    console.error('로그인 실패:', error);
    throw new Error('로그인 요청에 실패했습니다.');
  }
}

//회원가입
export async function joinAxios(userData: IUser) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/join`,
      userData,
      {
        headers: {
          'Content-Type': 'application/json', // JSON 형식으로 보내기
        },
      }
    );

    // 서버에서 받은 응답을 반환
    return response.data;
  } catch (error) {
    console.error('회원가입 실패:', error);
    throw new Error('회원가입 요청에 실패했습니다.');
  }
}

// 유저 정보 조회
export async function getUserAxios(accessToken: string) {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/getUser`, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // 토큰 포함
      },
    });

    return response.data;
  } catch (error) {
    console.error('유저 정보 조회 실패:', error);
    throw new Error('유저 정보 조회를 실패했습니다.');
  }
}
