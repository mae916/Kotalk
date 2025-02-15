import styled from 'styled-components';
import Modal from './Modal';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { userState } from '../recoil/auth/atom';
import { IUserAtom } from '../types';
import { resizeImage } from '../utils';
import { profileAxios } from '../api/upload';
import { stateMsgAxios } from '../api/profile';
import { getUserAxios } from '../api/auth';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const CloseBtn = styled.i`
  display: flex;
  justify-content: right;
  padding: 10px 10px 0 0;
  font-size: 0.8rem;
  color: #9e9e9e;
  cursor: pointer;
`;

const SettingBox = styled.div`
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  & > h2 {
    font-size: 0.85rem;
  }
`;
const ImgBox = styled.div`
  margin: 35px 0 25px;
  text-align: center;
  & label {
    position: relative;
    cursor: pointer;
  }
  & input {
    display: none;
  }
  & img {
    border-radius: 30px;
    width: 80px;
    height: 80px;
    object-fit: cover;
    border: 1px solid #dedede;
  }
  & i {
    position: absolute;
    bottom: 5px;
    left: 0px;
    border: 1px solid #cacaca;
    border-radius: 50%;
    padding: 2px 3px 3px;
    text-align: center;
    background-color: #fff;
    color: #4c4c4c;
    font-size: 0.9rem;
  }
`;
const SettingForm = styled.form`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const SettingInput = styled.div`
  position: relative;
  & > input {
    border: 0;
    border-bottom: 1px solid #000000;
    color: #000;
    font-size: 0.8rem;
    padding: 7px 1px;
    width: 100%;
  }
  & span {
    position: absolute;
    right: 0px;
    bottom: 7px;
    font-size: 0.77rem;
    color: #949391;
  }
`;
const SettingButtons = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
  & * {
    font-size: 0.8rem;
  }
  & button {
    border: 0;
    background-color: #fada0a;
    width: 70px;
    height: 35px;
    border-radius: 2px;
    cursor: pointer;
  }
  & div {
    border: 1px solid #d3d3d3;
    width: 70px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 7px;
    border-radius: 2px;
    cursor: pointer;
  }
`;

interface ProfileSettingProps {
  handleCloseModal: () => void;
  getUserInfo: () => void;
}

function ProfileSetting({
  handleCloseModal,
  getUserInfo,
}: ProfileSettingProps) {
  const [user, setUser] = useRecoilState<IUserAtom>(userState);
  const [previewImg, setPreviewImg] = useState<any>(user.profile_img_url || ''); //미리보기 img
  const [postImg, setPostImg] = useState<any>(null); // 서버에 보낼 img
  const [stateMsg, setStateMsg] = useState<string>(user.state_msg || '');

  function profileUploadHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target?.files?.[0];
    setPostImg(file);
    if (file && ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      const fileReader = new FileReader();
      fileReader.onload = () => setPreviewImg(fileReader.result);
      fileReader.readAsDataURL(file);
    } else {
      alert('이미지 파일만 업로드 가능합니다.');
    }
  }

  async function profileSubmitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (postImg) {
      const img = await resizeImage(postImg, 300, 300);
      const formData = new FormData();
      formData.append('image', img); // 서버의 키와 일치해야 함
      formData.append('user_id', String(user.user_id));
      await profileAxios(formData);
    }
    if (stateMsg) {
      const userData = { user_id: user.user_id, state_msg: stateMsg };
      await stateMsgAxios(userData);
    }
    // 모든 API 호출이 성공적으로 완료된 후, 유저 정보를 갱신
    getUserInfo();

    handleCloseModal();
  }

  function getStateMsg(event: React.ChangeEvent<HTMLInputElement>) {
    const {
      currentTarget: { value },
    } = event;
    setStateMsg(value);
  }

  return (
    <Modal>
      <Container>
        <CloseBtn
          className="xi-close"
          onClick={() => handleCloseModal()}
        ></CloseBtn>
        <SettingBox>
          <h2>기본프로필 편집</h2>
          <ImgBox>
            <label>
              <img src={previewImg} alt="" />
              <i className="xi-camera"></i>
              <input
                onChange={profileUploadHandler}
                type="file"
                accept=".png, .jpeg, .jpg"
              />
            </label>
          </ImgBox>
          <SettingForm onSubmit={profileSubmitHandler}>
            <SettingInput>
              <input
                type="text"
                value={stateMsg}
                placeholder="상태메시지"
                onChange={getStateMsg}
                maxLength={20}
              />
              <span>{stateMsg.length}/20</span>
            </SettingInput>
            <SettingButtons>
              <button>확인</button>
              <div onClick={() => handleCloseModal()}>취소</div>
            </SettingButtons>
          </SettingForm>
        </SettingBox>
      </Container>
    </Modal>
  );
}

export default ProfileSetting;
