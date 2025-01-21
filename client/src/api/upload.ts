import axios from 'axios';
//프로필 업로드 요청
export async function profileAxios(formData: any) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/upload/profile`,
      formData,
      {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      }
    );

    // 서버에서 받은 응답을 반환
    return response.data;
  } catch (error) {
    console.error('프로필 업로드 실패:', error);
    throw new Error('프로필 업로드 요청에 실패했습니다.');
  }
}
