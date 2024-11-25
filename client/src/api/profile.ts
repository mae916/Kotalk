import axios from 'axios';
//상태메시지 변경 요청
export async function stateMsgAxios(userData: any) {
  try {
    const response = await axios.post(
      'https://localhost:4000/profile/setStateMsg',
      userData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // 서버에서 받은 응답을 반환
    return response.data;
  } catch (error) {
    console.error('상태메시지 변경 실패:', error);
    throw new Error('상태메시지 변경 요청에 실패했습니다.');
  }
}
