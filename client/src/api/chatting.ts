import axios from 'axios';

// 채팅방 리스트 조회
export async function getChattingListAxios(userId: number) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/chatting/getChattingList`,
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
export async function getChatRoomInfoAxios(userId: number, roomId: number) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/chatting/getChatRoomInfo`,
      { userId, roomId },
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
      `${process.env.REACT_APP_API_URL}/chatting/createPersonalRoom`,
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

// 나와의 채팅방 생성 혹은 조회
export async function createAloneRoomAxios(userId: number) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/chatting/createAloneRoom`,
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
    console.error('나와의 채팅방 생성 혹은 조회 실패:', error);
    throw new Error('나와의 채팅방 생성 혹은 조회를 실패했습니다.');
  }
}

// 채팅 내용 조회
export async function getMsgListAxios(
  roomId: number,
  pageSize: number,
  lastId: number | null
) {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/chatting/getMsgList`,
      {
        params: {
          roomId,
          pageSize,
          lastId,
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
export async function setChatMessageAxios(msg: any) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/chatting/setChatMessage`,
      { msg },
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

// 읽지 않은 전체 메시지 수 조회
export async function getReadNotCountAxios(userId: any) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/chatting/getReadNotCount`,
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
    console.error('읽지 않은 전체 메시지 수 조회 실패:', error);
    throw new Error('읽지 않은 전체 메시지 수 조회를 실패 했습니다.');
  }
}

// 채팅 메시지 삭제
export async function setDeleteMessageAxios(msg: any) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/chatting/setDeleteMessage`,
      { msg },
      {
        headers: {
          'Content-Type': 'application/json', // JSON 형식으로 보내기
        },
      }
    );

    // 서버에서 받은 유저 정보 반환
    return response.data;
  } catch (error) {
    console.error('채팅 메시지 삭제 실패:', error);
    throw new Error('채팅 메시지 삭제를 실패 했습니다.');
  }
}
