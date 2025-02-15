import { atom } from 'recoil';
import { IUserAtom, ChatRoom } from '../../types';

export const userState = atom<IUserAtom>({
  key: 'userState',
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

export const participantState = atom<ChatRoom>({
  key: 'participantState',
  default: {
    images: [],
    last_message: '',
    last_message_created_at: '',
    names: [],
    room_id: 0,
    ids: [],
    room_name: '',
    read_n_count: 0,
  },
});
