import axios from 'axios';
import { IUser, IUserAtom } from '../types';
import { AxiosError } from 'axios';
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
    if (axios.isAxiosError(error)) {
      // error가 AxiosError 타입일 경우
      if (error.response) {
        // 서버가 응답을 보낸 경우
        const statusCode = error.response.status;
        const errorMsg =
          error.response.data?.message || '알 수 없는 오류가 발생했습니다. ';

        // 상태 코드에 따라 분기 처리
        if (statusCode === 401) {
          // 인증 실패 (아이디/비밀번호 불일치)
          console.error('아이디 또는 비밀번호가 잘못되었습니다.');
          alert(errorMsg);
        } else if (statusCode === 500) {
          // 서버 오류
          console.error('서버 오류');
          alert(errorMsg);
        } else {
          // 기타 상태 코드 처리
          console.error('알 수 없는 오류');
          alert(errorMsg);
        }
      } else if (error.request) {
        // 서버가 응답을 보내지 않은 경우
        alert('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
      } else {
        // 요청 설정 오류
        alert('로그인 요청에 실패했습니다.');
      }
    }
  }
}

//로그아웃
export async function logoutAxios(userData: IUserAtom) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/logout`,
      { email: userData.user_email },
      {
        headers: {
          'Content-Type': 'application/json', // JSON 형식으로 보내기
          Authorization: `Bearer ${userData.access_token}`, // 토큰 포함
        },
        withCredentials: true, // 쿠키 포함
      }
    );

    // 서버에서 받은 응답을 반환
    return response.data;
  } catch (error) {
    console.error('로그아웃 실패:', error);
    throw new Error('로그아웃 요청에 실패했습니다.');
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
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/auth/getUser`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // 토큰 포함
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('유저 정보 조회 실패:', error);
    throw new Error('유저 정보 조회를 실패했습니다.');
  }
}

// 이메일 계정 중복 조회
export async function emailCheckAxios(email: string) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/emailCheck`,
      { email },
      {
        headers: {
          'Content-Type': 'application/json', // JSON 형식으로 보내기
        },
      }
    );
    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // error가 AxiosError 타입일 경우
      if (error.response) {
        // 서버가 응답을 보낸 경우
        const statusCode = error.response.status;
        const errorMsg =
          error.response.data?.message || '알 수 없는 오류가 발생했습니다. ';

        // 상태 코드에 따라 분기 처리
        if (statusCode === 401) {
          console.error('이미 존재하는 계정');
          return errorMsg;
        } else if (statusCode === 500) {
          // 서버 오류
          console.error('서버 오류');
          alert(errorMsg);
        } else {
          // 기타 상태 코드 처리
          console.error('알 수 없는 오류');
          alert(errorMsg);
        }
      } else if (error.request) {
        // 서버가 응답을 보내지 않은 경우
        alert('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
      } else {
        // 요청 설정 오류
        alert('이메일 계정 중복 조회를 실패했습니다.');
      }
    }
  }
}
