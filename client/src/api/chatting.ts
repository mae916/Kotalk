import axios from 'axios';

// 유저 정보 조회
export async function getChattingListAxios(userId: number) {
  try {
    const response = await axios.post(
      'https://localhost:4000/chatting/getChattingList',
      { userId },
      {
        headers: {
          'Content-Type': 'application/json', // JSON 형식으로 보내기
        },
      }
    );

    // 서버에서 받은 유저 정보 반환
    return response.data;
  } catch (error) {
    console.error('채팅 리스트 조회 실패:', error);
    throw new Error('채팅 리스트 조회를 실패했습니다.');
  }
}
