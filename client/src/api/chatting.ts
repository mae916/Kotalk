import axios from 'axios';

// 채팅방 리스트 조회
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

    // 서버에서 받은 정보 반환
    return response.data;
  } catch (error) {
    console.error('채팅 리스트 조회 실패:', error);
    throw new Error('채팅 리스트 조회를 실패했습니다.');
  }
}

// 채팅방 정보 조회
export async function getChatRoomInfoAxios(roomId: number) {
  try {
    const response = await axios.post(
      'https://localhost:4000/chatting/getChatRoomInfo',
      { roomId },
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

// 개인채팅방 생성 혹은 조회
export async function createPersonalRoomAxios(
  userId: number,
  friendId: number
) {
  try {
    const response = await axios.post(
      'https://localhost:4000/chatting/createPersonalRoom',
      { userId, friendId },
      {
        headers: {
          'Content-Type': 'application/json', // JSON 형식으로 보내기
        },
      }
    );

    // 서버에서 받은 유저 정보 반환
    return response.data;
  } catch (error) {
    console.error('채팅방 생성 혹은 조회 실패:', error);
    throw new Error('채팅방 생성 혹은 조회를 실패했습니다.');
  }
}

// 채팅 내용 조회
export async function getMsgListAxios(roomId: number) {
  try {
    const response = await axios.post(
      'https://localhost:4000/chatting/getMsgList',
      { roomId },
      {
        headers: {
          'Content-Type': 'application/json', // JSON 형식으로 보내기
        },
      }
    );

    // 서버에서 받은 유저 정보 반환
    return response.data;
  } catch (error) {
    console.error('채팅 내용 조회 실패:', error);
    throw new Error('채팅 내용 조회를 실패했습니다.');
  }
}

// 채팅 메시지 저장
export async function setChatMessageAxios(msgList: any) {
  try {
    const response = await axios.post(
      'https://localhost:4000/chatting/setChatMessage',
      { msgList },
      {
        headers: {
          'Content-Type': 'application/json', // JSON 형식으로 보내기
        },
      }
    );

    // 서버에서 받은 유저 정보 반환
    return response.data;
  } catch (error) {
    console.error('채팅 메시지 저장 실패:', error);
    throw new Error('채팅 메시지 저장을 실패했습니다.');
  }
}
