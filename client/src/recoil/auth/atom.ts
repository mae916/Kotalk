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
    last_message_date: '',
    names: [],
    room_id: 0,
    user_ids: [],
    room_name: '',
    room_uuid: '',
    read_n_count: 0,
    type: '',
    room_key: '',
  },
});
