import styled from 'styled-components';
import Modal from './Modal';
import { useRecoilValue } from 'recoil';
import { userState } from '../recoil/auth/atom';
import { IUserAtom } from '../types';

const TopBtnsBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const BgBtn = styled.i`
  color: #ffffff;
  margin: 12px 0 0 14px;
  border: 1px solid #ffffff;
  border-radius: 5px;
  padding: 2px;
  font-size: 0.8rem;
`;

const BottomBtnsBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  border-top: 1px solid #ffffff28;
  min-height: 163px;
  height: 30%;
  & div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    width: 50%;
    height: 100%;
    cursor: pointer;
    & i {
      margin-bottom: 15px;
    }
    & span {
      font-size: 0.7rem;
    }
  }
`;

const PositionBottom = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const CloseBtn = styled.i`
  display: flex;
  justify-content: right;
  margin: 10px 10px 0 0;
  font-size: 0.8rem;
  color: #c6c6c6;
  cursor: pointer;
`;

const MyInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;

  & > img {
    width: 50px;
    height: 50px;
    border-radius: 20px;
    margin-right: 10px;
    object-fit: cover;
  }
`;

const UserName = styled.span`
  font-size: 0.65rem;
  font-weight: 700;
`;

const StateMsg = styled.div`
  font-size: 0.65rem;
  margin-top: 7px;
`;

const ProfileBox = styled.div<{ bg: string }>`
  background-image: url(${(props) => props.bg});
  background-size: cover;
  background-position: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  & ${CloseBtn} {
    color: #ffffffba;
  }
  & ${MyInfo} {
    flex-direction: column;
    border: 0;
    color: #ffffff;
    & img {
      margin: 0;
      margin-bottom: 12px;
      width: 70px;
      height: 70px;
    }
    & ${UserName} {
      font-size: 0.9rem;
    }
  }
`;

interface ProfileProps {
  handleCloseModal: () => void;
  handleOpenModal: (string: string) => void;
  chatToMe: () => void;
}
function Profile({
  handleCloseModal,
  handleOpenModal,
  chatToMe,
}: ProfileProps) {
  const user = useRecoilValue<IUserAtom>(userState);
  return (
    <Modal>
      <ProfileBox bg={user.bg_img_url}>
        <TopBtnsBox>
          <BgBtn className="xi-image-o"></BgBtn>
          <CloseBtn
            className="xi-close"
            onClick={() => handleCloseModal()}
          ></CloseBtn>
        </TopBtnsBox>
        <PositionBottom>
          <MyInfo>
            <img src={user.profile_img_url} alt="" />
            <UserName>{user.user_name}</UserName>
            <StateMsg>{user.state_msg}</StateMsg>
          </MyInfo>
          <BottomBtnsBox>
            <div onClick={chatToMe}>
              <i className="xi-speech"></i>
              <span>나와의 채팅</span>
            </div>
            <div onClick={() => handleOpenModal('profileSetting')}>
              <i className="xi-pen"></i>
              <span>프로필 편집</span>
            </div>
          </BottomBtnsBox>
        </PositionBottom>
      </ProfileBox>
    </Modal>
  );
}

export default Profile;
