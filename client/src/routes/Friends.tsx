import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Modal from '../components/Modal';
import { useRecoilState } from 'recoil';
import { userDataState } from '../recoil/auth/atom';
import { profileAxios } from '../api/upload';
import { stateMsgAxios } from '../api/profile';
import { getUserAxios } from '../api/auth';
import { IUserAtom } from '../types';
import {
  addFriendAxios,
  getFriendsListAxios,
  searchUserAxios,
} from '../api/friends';
import { useForm } from 'react-hook-form';
import { handleClick, resizeImage } from '../utils';
import ChattingRoom from './ChattingRoom';

const Container = styled.div``;
const TitleBox = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  margin: 0 18px 10px 0;
`;
const ContentBox = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  margin-left: -17px;
  padding-left: 17px;
  height: 514px;

  &::-webkit-scrollbar {
    width: 14px; /* 세로 스크롤바 폭 */
  }

  /* 스크롤바 막대 */
  &::-webkit-scrollbar-thumb {
    background-color: #cccccc; /* 스크롤바 막대 색상 */
    border-radius: 12px;
    border: 3px solid #ffffff;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #7f7f7f;
  }
  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0); /* 스크롤바 뒷 배경을 투명 처리한다 */
  }
`;
const TopMenu = styled.ul`
  display: flex;
  & i {
    font-size: 1.1rem;
    color: #9d9d9d;
  }
  & > li:first-child i {
    margin-right: 10px;
  }
`;
const MyInfo = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0 20px;
  padding-top: 15px;

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

const FriendsBox = styled.div`
  padding-top: 15px;
`;

const FriendCount = styled.div`
  color: #7a7a7a;
  font-size: 0.65rem;
  display: flex;
  align-items: end;
  margin-bottom: 5px;
  & > h2 {
    margin-right: 5px;
  }
  span {
    font-size: 0.7rem;
  }
`;
const FriendListBox = styled.ul``;
const FriendList = styled.li<{ $isSelected: boolean }>`
  margin-left: -17px;
  display: flex;
  align-items: center;
  padding: 7px 7px 7px 17px;
  background-color: ${(props) =>
    props.$isSelected ? '#ededed' : 'transparent'};
  &:hover {
    background-color: #f5f5f5;
  }

  & img {
    width: 50px;
    height: 50px;
    border-radius: 18px;
    object-fit: cover;
    margin-right: 10px;
  }
`;
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
const CloseBtn = styled.i`
  display: flex;
  justify-content: right;
  margin: 10px 10px 0 0;
  font-size: 0.8rem;
  color: #c6c6c6;
`;
const AddBox = styled.div`
  padding: 20px;
  & > h2 {
    font-size: 0.9rem;
    color: #2b2b2b;
  }
  & input {
    border: 0;
    border-bottom: 1px solid #eaeaea;
    font-size: 0.8rem;
    margin-top: 30px;
    padding: 10px 2px;
    width: 100%;
  }
`;
const FriendProfile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 35px;
  & > img {
    width: 60px;
    height: 60px;
    border-radius: 23px;
    object-fit: cover;
    margin-bottom: 12px;
  }
  & > h3 {
    font-size: 0.65rem;
    font-weight: 600;
    margin-bottom: 6px;
  }
  & > span {
    font-size: 0.65rem;
    margin-bottom: 70px;
    color: #a6a6a6;
  }
`;
const AddSubmitBtn = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
  & > button {
    color: #000000;
    background-color: #fee500;
    height: 34px;
    border-radius: 2px;
    margin-top: 5px;
    border: 0;
    font-size: 0.7rem;
    width: 80px;
    &:disabled {
      color: #adadad;
      background-color: #f6f6f6;
    }
  }
`;

const ErrorMsg = styled.span`
  font-size: 0.65rem;
  color: #8d8d8d;
  margin-top: 5px;
`;

const ProfileBox = styled.div<{ bg: string }>`
  background-image: url(${(props) => props.bg});
  background-size: cover;
  background-position: center;
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
const StateMsg = styled.div`
  font-size: 0.65rem;
  margin-top: 7px;
`;

const BottomBtnsBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  border-top: 1px solid #ffffff28;
  padding: 30px 0;
  & div {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #ffffff;
    & i {
      margin-bottom: 15px;
    }
    & span {
      font-size: 0.7rem;
    }
  }
`;

const PositionBottom = styled.div`
  margin-top: 200px;
  bottom: 0;
  left: 0;
  width: 100%;
`;
const SettingBox = styled.div`
  padding: 20px;
  & > h2 {
    font-size: 0.85rem;
  }
`;
const ImgBox = styled.div`
  position: relative;
  margin: 35px 0 25px;
  text-align: center;
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
    left: 147px;
    border: 1px solid #cacaca;
    border-radius: 50%;
    padding: 2px 3px 3px;
    text-align: center;
    background-color: #fff;
    color: #4c4c4c;
    font-size: 0.9rem;
  }
`;
const SettingForm = styled.form``;

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
  margin-top: 150px;
  & * {
    font-size: 0.68rem;
  }
  & button {
    border: 0;
    background-color: #fada0a;
    width: 70px;
    height: 35px;
    border-radius: 2px;
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
  }
`;

const Line = styled.hr`
  width: 98%;
  border: 0px;
  border-top: 1px solid #f6f6f6;
  margin: 0;
`;

function Friends() {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [user, setUser] = useRecoilState<IUserAtom>(userDataState);
  const [postImg, setPostImg] = useState<any>(null); // 서버에 보낼 img
  const [previewImg, setPreviewImg] = useState<any>(user.profile_img_url || ''); //미리보기 img
  const [stateMsg, setStateMsg] = useState<string>(user.state_msg || '');
  const [keyword, setKeyword] = useState<string>('');
  const [searchUser, setSearchUser] = useState<any>(null);
  const [friends, setFriends] = useState<any>([]);
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<number>(0);

  const {
    register,
    formState: { isValid, errors },
  } = useForm<any>();

  useEffect(() => {
    (async () => {
      await getUserInfo();
      await getFriendList();
    })();
  }, []);

  async function getUserInfo() {
    try {
      const { data } = await getUserAxios(user.access_token);
      setUser(data);
    } catch (error) {
      console.error('유저 정보 조회 실패:', error);
    }
  }

  async function getFriendList() {
    try {
      const { data } = await getFriendsListAxios(user.user_id);
      setFriends(data);
    } catch (error) {
      console.error('친구 목록 조회 실패:', error);
    }
  }

  function handleOpenModal(modalType: string) {
    setOpenModal(modalType); // 특정 모달 열기
  }

  function handleCloseModal() {
    setOpenModal(null); // 모든 모달 닫기
  }

  function getStateMsg(event: React.ChangeEvent<HTMLInputElement>) {
    const {
      currentTarget: { value },
    } = event;
    setStateMsg(value);
  }

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
    await getUserInfo();

    handleCloseModal();
  }

  function getKeywordHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const {
      currentTarget: { value },
    } = event;
    setKeyword(value);
  }

  async function getSearchFriends(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = await searchUserAxios(keyword);
    setSearchUser(data.user);
  }

  async function addFriendHandler() {
    const friendId = searchUser.user_id;
    const userId = user.user_id;
    const friendName = searchUser.user_name;
    await addFriendAxios({ friendId, userId, friendName });
    await getFriendList();
    handleCloseModal();
  }

  function friendListClick(id: number) {
    setSelectedFriendId(id);
  }
  function friendListDbClick(id: number) {
    handleOpenModal('chatting');
    setSelectedChatId(id);
  }

  return (
    <Container>
      <TitleBox>
        <h1>친구</h1>
        <TopMenu>
          <li>
            <i className="xi-search"></i>
          </li>
          <li onClick={() => handleOpenModal('addFriend')}>
            <i className="xi-user-plus-o"></i>
          </li>
        </TopMenu>
      </TitleBox>
      <ContentBox>
        <Line />
        <MyInfo>
          <img
            onClick={() => handleOpenModal('profile')}
            src={user.profile_img_url}
            alt=""
          />
          <div>
            <UserName>{user.user_name}</UserName>
            <StateMsg>{user.state_msg}</StateMsg>
          </div>
        </MyInfo>
        <Line />
        <FriendsBox>
          <FriendCount>
            <h2>친구</h2>
            <span>{friends ? friends.length : 0}</span>
          </FriendCount>
          <FriendListBox>
            {friends?.map((fr: any) => (
              <FriendList
                $isSelected={selectedFriendId === fr.friend_id}
                onClick={(e) =>
                  handleClick(
                    e,
                    () => friendListClick(fr.friend_id),
                    () => friendListDbClick(fr.friend_id)
                  )
                }
                key={fr.id}
              >
                <img
                  onClick={() => handleOpenModal('FriendProfile')}
                  src={fr.profile_img_url}
                  alt=""
                />
                <div>
                  <UserName>{fr.friend_name}</UserName>
                  <StateMsg>{fr.state_msg}</StateMsg>
                </div>
              </FriendList>
            ))}
          </FriendListBox>
        </FriendsBox>
      </ContentBox>
      {openModal === 'addFriend' && (
        <Modal>
          <CloseBtn
            className="xi-close"
            onClick={() => handleCloseModal()}
          ></CloseBtn>
          <AddBox>
            <h2>친구 추가</h2>
            <form onSubmit={getSearchFriends}>
              <SettingInput>
                <input
                  {...register('user_email', {
                    required: '친구 이메일 계정을 입력하세요.',
                    pattern: {
                      value:
                        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                      message: '이메일 형식이 아닙니다.',
                    },
                  })}
                  onChange={getKeywordHandler}
                  type="text"
                  placeholder="친구 이메일 계정"
                  maxLength={30}
                />
                <span>{keyword.length}/30</span>
              </SettingInput>
              <ErrorMsg>
                {errors.user_email && String(errors.user_email?.message)}
              </ErrorMsg>
            </form>
            {searchUser && (
              <FriendProfile>
                <img src={searchUser.profile_img_url} alt="" />
                <h3>{searchUser.user_name}</h3>
                <span>{searchUser.state_msg}</span>
                <AddSubmitBtn>
                  <button
                    onClick={addFriendHandler}
                    disabled={!isValid || !searchUser}
                  >
                    친구 추가
                  </button>
                </AddSubmitBtn>
              </FriendProfile>
            )}
          </AddBox>
        </Modal>
      )}
      {openModal === 'profile' && (
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
                <div>
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
      )}
      {openModal === 'profileSetting' && (
        <Modal>
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
        </Modal>
      )}
      {openModal === 'chatting' && (
        <ChattingRoom
          id={selectedChatId}
          handleCloseModal={handleCloseModal}
        ></ChattingRoom>
      )}
    </Container>
  );
}

export default Friends;
