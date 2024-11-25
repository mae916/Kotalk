export interface IUser {
  user_email: string;
  password: string;
  password2: string;
  user_name: string;
  refresh_token: string;
  access_token: string;
}

export interface IUserAtom {
  user_id: number;
  user_email: string;
  user_name: string;
  access_token: string;
  profile_img_url: string;
  bg_img_url: string;
  state_msg: string;
}

export interface IModal {
  children: React.ReactNode;
}
