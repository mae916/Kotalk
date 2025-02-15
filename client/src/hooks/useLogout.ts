import { useRecoilState } from 'recoil';
import { userState } from '../recoil/auth/atom';
import { useNavigate } from 'react-router-dom';
import { logoutAxios } from '../api/auth';
import { IUserAtom } from '../types';
export const useLogout = () => {
  const [user, setUser] = useRecoilState<IUserAtom>(userState);
  const navigate = useNavigate();

  const logout = async () => {
    // Recoil 상태에서 사용자 정보 제거
    setUser({
      user_id: 0,
      user_email: '',
      user_name: '',
      access_token: '',
      profile_img_url: '',
      bg_img_url: '',
      state_msg: '',
    });

    // 서버에 로그아웃 요청
    await logoutAxios(user);

    // 로그인 페이지로 리다이렉트
    navigate('/login');
  };

  return logout;
};
