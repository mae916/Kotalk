import axios from 'axios';

// 친구 추가를 위한 유저 조회
export async function searchUserAxios(keyword: string) {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/friends/searchUser`,
      {
        params: {
          keyword, // 서버에 보낼 매개변수
        },
      }
    );
    // 서버에서 받은 유저 정보 반환
    return response.data;
  } catch (error) {
    console.error('유저 조회 실패:', error);
    throw new Error('유저 조회를 실패했습니다.');
  }
}

// 친구 추가
export async function addFriendAxios(userData: any) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/friends/addFriend`,
      userData,
      {
        headers: {
          'Content-Type': 'application/json', // JSON 형식으로 보내기
        },
      }
    );

    // 서버에서 받은 유저 정보 반환
    return response.data;
  } catch (error) {
    console.error('친구 추가 실패:', error);
    throw new Error('친구 추가를 실패했습니다.');
  }
}

// 친구 정보 조회
export async function getFriendInfoAxios(userData: any) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/friends/getFriendInfo`,
      userData,
      {
        headers: {
          'Content-Type': 'application/json', // JSON 형식으로 보내기
        },
      }
    );

    // 서버에서 받은 유저 정보 반환
    return response.data;
  } catch (error) {
    console.error('친구 정보 조회 실패:', error);
    throw new Error('친구 정보 조회를 실패했습니다.');
  }
}

// 내 친구 리스트 조회
export async function getFriendsListAxios(userId: number) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/friends/getFriendsList`,
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
    console.error('친구 리스트 조회 실패:', error);
    throw new Error('친구 리스트 조회를 실패했습니다.');
  }
}
