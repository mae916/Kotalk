import { atom } from 'recoil';
import { IUserAtom } from '../../types';

export const userDataState = atom<IUserAtom>({
  key: 'userDataState',
  default: {
    user_id: 0,
    user_email: '',
    user_name: '',
    access_token: '',
    profile_img_url: '',
    bg_img_url: '',
    state_msg: '',
  },
});
